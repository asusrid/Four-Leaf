// SPDX-License-Identifier: No License (None)
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

contract FourLeaf is VRFConsumerBaseV2, ConfirmedOwner {

    uint16 private requestConfirmations;
    uint32 private callbackGasLimit;
    uint32 private numWords;
    uint64 private s_subscriptionId;
    uint256 public loteryaId = 0;
    uint256 private requestId;
    bytes32 private keyHash;
    bool private locked;
    address private loteryaOwner;
    address private oracle;

    VRFCoordinatorV2Interface private COORDINATOR;
    AggregatorV3Interface internal priceFeed;

    mapping(uint256 => bool) private existsRequestId;
    mapping(uint256 => Game) games;

    struct Game {
        bool isFinished;
        uint32 winnerNumber;
        mapping(uint32 => bool) exclusiveNumbers;
        mapping(uint32 => address[]) numbersToOwners;
        mapping(address => uint32[]) ownersToNumbers;
    }

    event RequestFulfilled(uint256 indexed loteryaId, uint32 winnerNumber, uint256 reward);
    event NumberPurchased(uint256 indexed loteryaId, uint256 reward);

    constructor(
        address _consumer, 
        uint64 _subscriptionId, 
        address _oracle,
        bytes32 _keyHash,
        address _priceFeed,
        uint16 _requestConfirmations,
        uint32 _callbackGasLimit,
        uint32 _numWords
    )
        VRFConsumerBaseV2(_consumer)
        ConfirmedOwner(msg.sender)
    {
        COORDINATOR = VRFCoordinatorV2Interface(_consumer);
        s_subscriptionId = _subscriptionId;
        loteryaOwner = msg.sender;
        oracle = _oracle;
        keyHash = _keyHash;
        priceFeed = AggregatorV3Interface(_priceFeed);
        requestConfirmations = _requestConfirmations;
        callbackGasLimit = _callbackGasLimit;
        numWords = _numWords;
    }

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyOracle() {
        require(
            msg.sender == oracle,
            "Only oracle is allowed to request random numbers"
        );
        _;
    }

    function requestRandomWords(uint32 _numWords) public onlyOracle returns (uint256) {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            _numWords
        );
        existsRequestId[requestId] = true;
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(existsRequestId[_requestId], "Request not found");
        require(!games[loteryaId].isFinished, "Lottery finished");

        uint32 winnerNumber = getFormatNumber(_randomWords);
        games[loteryaId].winnerNumber = winnerNumber;
        games[loteryaId].isFinished = true;
        // share reward with winners (if there are)
        shareRewards(winnerNumber);
        emit RequestFulfilled(loteryaId, winnerNumber, getRewardUSD());
        // next lottery game
        loteryaId += 1;
    }

    function shareRewards(uint32 _winnerNumber) private noReentrant {
        uint256 reward = address(this).balance;

        if (games[loteryaId].exclusiveNumbers[_winnerNumber]) {
            (bool sent, ) = (games[loteryaId].numbersToOwners[_winnerNumber][0]).call{ value: reward }("");
            require(sent, "Reward was not shared correctly to user");
        } else {
            uint256 numWinners = games[loteryaId].numbersToOwners[_winnerNumber].length;
            if (numWinners != 0) {
                for (uint i = 0; i < numWinners; i++) {
                    (bool sent, ) = (games[loteryaId].numbersToOwners[_winnerNumber][i]).call{ value: reward / numWinners }("");
                    require(sent, "Reward was not shared correctly to user");
                }
            }
        }        
    }

    function getFormatNumber(
        uint256[] memory _randomWords
    ) private view returns (uint32) {
        bytes memory output;
        for (uint i = 0; i < _randomWords.length; i++) {
            output = abi.encodePacked(output, getRandomNumber(_randomWords[i]));
        }
        return stringToUint(string(output));
    }

    function getRandomNumber(
        uint256 _randomNumber
    ) private view returns (string memory) {
        uint rand = uint(
            keccak256(
                abi.encodePacked(
                    _randomNumber,
                    block.timestamp,
                    block.difficulty,
                    msg.sender
                )
            )
        ) % 10;
        return Strings.toString(rand);
    }

    function stringToUint(string memory s) private pure returns (uint32) {
        bytes memory b = bytes(s);
        uint32 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            uint32 c = uint32(uint8(b[i]));
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
        return result;
    }

    // let the user buy all the possible numbers for a particular combination
    function getExclusivity(uint32 _number) external payable returns (bool) {

        uint256 price = getLatestPrice(true);
        require(
            msg.value >= price,
            "E01 - Not enough funds to purchase the number"
        );
        require(
            !games[loteryaId].isFinished,
            "E02 - Lottery game is over"
        );
        require(
            !games[loteryaId].exclusiveNumbers[_number],
            "E03 - This number is already in exclusivity"
        );
        require(
            checkOnlyThisUserHasPurchasedNumber(msg.sender, _number),
            "E04 - Number purchased by another user, you cannot ask exclusivity"
        );
        

        sharePriceNumber(price);

        games[loteryaId].exclusiveNumbers[_number] = true;
        games[loteryaId].numbersToOwners[_number].push(msg.sender);
        games[loteryaId].ownersToNumbers[msg.sender].push(_number);

        emit NumberPurchased(loteryaId, getRewardUSD());

        return true;
    }

    function checkOnlyThisUserHasPurchasedNumber(address _user, uint32 _number) private view returns(bool) {
        // if the user who is asking for exclusivity is the same that bought this number
        // previously, then allow exclusivity
        if (games[loteryaId].numbersToOwners[_number].length != 0) {
            // go through users to see if any of the buyers is different from the
            // one asking for exclusivity
            for (uint i = 0; i < games[loteryaId].numbersToOwners[_number].length; i++) {
                if (games[loteryaId].numbersToOwners[_number][i] != _user) {
                    return false;
                }
            }
        }
        return true;
    }

    // let the user bet for a number
    function betNumber(
        uint32 _number
    ) external payable returns (bool) {

        uint256 price = getLatestPrice(false);
        require(
            msg.value >= price,
            "E01 - Not enough funds to purchase the number"
        );
        require(
            isPurchasable(_number),
            "E06 - All possible numbers have been purchased"
        );
        require(
            !games[loteryaId].isFinished,
            "E02 - Lottery game is over"
        );

        sharePriceNumber(price);

        games[loteryaId].numbersToOwners[_number].push(msg.sender);
        games[loteryaId].ownersToNumbers[msg.sender].push(_number);

        emit NumberPurchased(loteryaId, getRewardUSD());

        return true;
    }

    function sharePriceNumber(uint256 _price) private {
        (bool sentToApp, ) = address(this).call{value: (_price / 25) * 24}("");
        require(sentToApp, "E05 - Failed to send MATIC to App");
        (bool sentToOwner, ) = loteryaOwner.call{value: _price / 25}("");
        require(sentToOwner, "E05 - Failed to send MATIC to Owner");
    }

    // to get the last rate of USD - MATIC
    function getLatestPrice(bool _exclusivity) public view returns (uint256) {
        (, int price, , , ) = priceFeed.latestRoundData();
        uint256 rate;
        if (_exclusivity) {
            rate = uint((18 * 10 ** 26) / int(price));
        } else {
            rate = uint((2 * 10 ** 26) / int(price));
        }
        return rate;
    }

    // to check there arent more than 10 numbers purchased
    function isPurchasable(uint32 _number) private view returns(bool) {
        if (games[loteryaId].numbersToOwners[_number].length >= 10 || games[loteryaId].exclusiveNumbers[_number]) {
            return false;
        }
        return true;
    }
    
    function getRewardUSD() public view returns(uint) {
        (, int price, , , ) = priceFeed.latestRoundData();
        return (address(this).balance * uint(price));
    }

    function getMyNumbers(uint _loteryaId) external view returns(uint32[] memory) {
        return games[_loteryaId].ownersToNumbers[msg.sender];
    }

    function getRemainingNumbers(uint32 _number) external view returns(uint256) {
        if (games[loteryaId].exclusiveNumbers[_number]) {
            return 10;
        } else {
            return games[loteryaId].numbersToOwners[_number].length;
        }
    }

    function getNumberIsExclusive(uint32 _number) external view returns(bool) {
        return games[loteryaId].exclusiveNumbers[_number];
    }

    receive() external payable {}

    fallback() external payable {}
}
