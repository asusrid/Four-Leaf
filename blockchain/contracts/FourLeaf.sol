// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";
import "hardhat/console.sol";

contract FourLeaf is VRFConsumerBaseV2, ConfirmedOwner, AutomationCompatibleInterface  {

    uint16 private requestConfirmations;
    uint32 private callbackGasLimit;
    uint32 private numWords;
    uint64 private s_subscriptionId;
    uint256 public loteryaId = 0;
    uint256 private requestId;
    uint256 private available;
    uint256 private immutable interval;
    uint256 private lastTimeStampGroup0;
    uint256 private lastTimeStampGroup1;
    bytes32 private keyHash;
    bool private locked;
    address private loteryaOwner;
    address private timeOracle;
    address private logicOracle;

    VRFCoordinatorV2Interface private COORDINATOR;
    AggregatorV3Interface internal priceFeed;

    mapping(uint256 => bool) private existsRequestId;
    mapping(uint256 => Game) public games;

    struct Game {
        bool isFinished;
        string winnerNumber;
        string[] numbers;
        mapping(string => bool) exclusiveNumbers;
        mapping(string => address[]) numbersToOwners;
        mapping(address => string[]) ownersToNumbers;
    }

    event RequestFulfilled(
        uint256 indexed loteryaId,
        string winnerNumber,
        uint256 reward
    );
    event NumberPurchased(uint256 indexed loteryaId, uint256 reward, string number);

    constructor(
        address _consumer,
        uint64 _subscriptionId,
        address _timeOracle,
        address _logicOracle,
        bytes32 _keyHash,
        address _priceFeed,
        uint16 _requestConfirmations,
        uint32 _callbackGasLimit,
        uint32 _numWords,
        uint256 updateInterval
    ) VRFConsumerBaseV2(_consumer) ConfirmedOwner(msg.sender) {
        loteryaOwner = msg.sender;
        timeOracle = _timeOracle;
        logicOracle = _logicOracle;
        keyHash = _keyHash;
        s_subscriptionId = _subscriptionId;
        requestConfirmations = _requestConfirmations;
        callbackGasLimit = _callbackGasLimit;
        numWords = _numWords;
        priceFeed = AggregatorV3Interface(_priceFeed);
        COORDINATOR = VRFCoordinatorV2Interface(_consumer);
        interval = updateInterval;
        lastTimeStampGroup0 = block.timestamp;
        lastTimeStampGroup1 = block.timestamp;
    }

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyTimeOracle() {
        require(
            msg.sender == timeOracle,
            "Only oracle is allowed to request random numbers"
        );
        _;
    }

    modifier onlyLogicOracle() {
        require(
            msg.sender == logicOracle,
            "Only oracle is allowed to request random numbers"
        );
        _;
    }

    function requestRandomWords(
        uint32 _numWords
    ) public onlyTimeOracle returns (uint256) {
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

        string memory winnerNumber = getFormatNumber(_randomWords);
        games[loteryaId].winnerNumber = winnerNumber;
        games[loteryaId].isFinished = true;
        available = address(this).balance - (address(this).balance / 100);

        emit RequestFulfilled(loteryaId, winnerNumber, getRewardUSD());
        loteryaId += 1;
    }

    function checkUpkeep(bytes calldata checkData) onlyLogicOracle external view override returns (bool upkeepNeeded, bytes memory performData) {

        (uint256 group) = abi.decode(
            checkData,
            (uint256)
        );

        require(group == 0 || group == 1, "Group not correct");

        if (group == 0) {
            upkeepNeeded = (block.timestamp - lastTimeStampGroup0) > interval;
        } else {
            upkeepNeeded = (block.timestamp - lastTimeStampGroup1) > interval;
        }
        require(upkeepNeeded, "Not enough time has elapsed");

        require(games[loteryaId-1].isFinished, "Draw not finished");

        string memory first = "";
        bytes memory second;
        bytes memory third;
        bytes memory fourth; 
        uint256 secondCounter;
        uint256 thirdCounter;
        uint256 fourthCounter;
        bool isFirst = false;
        bool isSecond = false;
        bool isThird = false;
        bool isFourth = false;

        for (uint256 i = 0; i < games[loteryaId-1].numbers.length; i++) {

            if (areEqual(games[loteryaId-1].winnerNumber, games[loteryaId-1].numbers[i])) {
                if (group == 0) {
                    first = games[loteryaId-1].winnerNumber;
                    isFirst = true;
                }                
            } else if (areEqual(getSlice(1, 5, games[loteryaId-1].winnerNumber), getSlice(1, 5, games[loteryaId-1].numbers[i]))) {
                if (group == 0) {
                    second = abi.encodePacked(second, games[loteryaId-1].numbers[i]);
                    secondCounter++;    
                    isSecond = true;        
                }                
            } else if (areEqual(getSlice(2, 5, games[loteryaId-1].winnerNumber), getSlice(2, 5, games[loteryaId-1].numbers[i]))) {
                if (group == 0) {
                    third = abi.encodePacked(third, games[loteryaId-1].numbers[i]);
                    thirdCounter++;
                    isThird = true;
                }                
            } else if (areEqual(getSlice(3, 5, games[loteryaId-1].winnerNumber), getSlice(3, 5, games[loteryaId-1].numbers[i]))) {
                if (group == 1) {
                    fourth = abi.encodePacked(fourth, games[loteryaId-1].numbers[i]);
                    fourthCounter++;
                    isFourth = true;
                }
            } 
        }

        if (group == 0) {
            upkeepNeeded = isFirst || isSecond || isThird;
        } else {
            upkeepNeeded = isFourth;
        }

        performData = abi.encode(group, first, secondCounter, second, thirdCounter, third, fourthCounter, fourth);

        return (upkeepNeeded, performData);
    }

    function performUpkeep(bytes calldata performData) onlyLogicOracle external override {
        
        (uint256 group, string memory first, uint256 numSecond, bytes memory second, uint256 numThird, bytes memory third, uint256 numFourth, bytes memory fourth) = abi.decode(
            performData,
            (uint256, string, uint256, bytes, uint256, bytes, uint256, bytes)
        );
        
        require(
            group == 0 || group == 1, 
            "Group is not correct"
        );

        require(games[loteryaId-1].isFinished, "Draw not finished");

        if (group == 0) {
            if (!areEqual(first, "")) {
                uint prize = available - ((available * 3) / 100) - ((available * 2) / 100) - ((available * 1) / 100);
                sharePrize(first, prize);
            }
            if (numSecond != 0) {
                uint prize = (available * 3) / 100;    
                for (uint256 i = 0; i < numSecond; i++) {
                    sharePrize(getSlice(i*6, i*6+6-1, string(second)), (prize / numSecond));
                }
            }
            if (numThird != 0) {
                uint prize = (available * 2) / 100;
                for (uint256 i = 0; i < numThird; i++) {
                    sharePrize(getSlice(i*6, i*6+6-1, string(third)), (prize / numThird));
                }
            }           
            lastTimeStampGroup0 = block.timestamp;
        } else {
            if (numFourth != 0) {
                uint prize = (available * 1) / 100;
                for (uint256 i = 0; i < numFourth; i++) {
                    sharePrize(getSlice(i*6, i*6+6-1, string(fourth)), (prize / numFourth));
                }
            }
            lastTimeStampGroup1 = block.timestamp;
        }
    }

    function getFormatNumber(uint256[] memory _randomWords) private view returns (string memory) {
        bytes memory output;
        for (uint i = 0; i < _randomWords.length; i++) {
            output = abi.encodePacked(output, getRandomNumber(_randomWords[i]));
        }
        return string(output);
    }

    function getRandomNumber(uint256 _randomNumber) private view returns (string memory) {
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

    function getSlice(uint256 begin, uint256 end, string memory text) private pure returns (string memory) {
        bytes memory a = new bytes(end - begin + 1);
        for(uint i = 0; i <= end - begin; i++){
            a[i] = bytes(text)[i + begin];
        }
        return string(a);    
    }

    function areEqual(string memory a, string memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function sharePrize(string memory _number, uint256 _prize) private noReentrant {

        if (games[loteryaId-1].exclusiveNumbers[_number]) {
            (bool sent, ) = (games[loteryaId-1].numbersToOwners[_number][0]).call{ value: _prize }("");
            require(sent, "Reward was not shared correctly to user");
        } else {
            uint256 numWinners = games[loteryaId-1].numbersToOwners[_number].length;
            if (numWinners != 0) {
                for (uint i = 0; i < numWinners; i++) {
                    (bool sent, ) = (games[loteryaId-1].numbersToOwners[_number][i]).call{ value: _prize / numWinners }("");
                    require(sent, "Reward was not shared correctly to user");
                }
            }
        }
    }

    function getExclusivity(string memory _number) external payable {
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
        if (!checkNumberExist(_number)) {
            games[loteryaId].numbers.push(_number);
        }  
        games[loteryaId].exclusiveNumbers[_number] = true;
        games[loteryaId].numbersToOwners[_number].push(msg.sender);
        games[loteryaId].ownersToNumbers[msg.sender].push(_number);

        emit NumberPurchased(loteryaId, getRewardUSD(), _number);
    }

    function checkOnlyThisUserHasPurchasedNumber(
        address _user,
        string memory _number
    ) private view returns (bool) {
        // if the user who is asking for exclusivity is the same that bought this number
        // previously, then allow exclusivity
        if (games[loteryaId].numbersToOwners[_number].length != 0) {
            // go through users to see if any of the buyers is different from the
            // one asking for exclusivity
            for (uint i = 0; i < games[loteryaId].numbersToOwners[_number].length;i++) {
                if (games[loteryaId].numbersToOwners[_number][i] != _user) {
                    return false;
                }
            }
        }
        return true;
    }

    // let the user bet for a number
    function betNumber(string memory _number) external payable {
        uint256 price = getLatestPrice(false);
        require(
            msg.value >= price,
            "E01 - Not enough funds to purchase the number"
        );
        require(
            isPurchasable(_number),
            "E06 - All possible numbers have been purchased"
        );
        require(!games[loteryaId].isFinished, "E02 - Lottery game is over");

        sharePriceNumber(price);
        if (!checkNumberExist(_number)) {
            games[loteryaId].numbers.push(_number);
        }        
        games[loteryaId].numbersToOwners[_number].push(msg.sender);
        games[loteryaId].ownersToNumbers[msg.sender].push(_number);

        emit NumberPurchased(loteryaId, getRewardUSD(), _number);
    }

    function checkNumberExist(string memory _number) private view returns (bool) {
        for (uint i = 0; i < games[loteryaId].numbers.length; i++) {
            if (areEqual(games[loteryaId].numbers[i], _number)) {
                return true;
            }
        }
        return false;
    }

    // to check there arent more than 10 numbers purchased
    function isPurchasable(string memory _number) private view returns (bool) {
        if (games[loteryaId].numbersToOwners[_number].length >= 10 || games[loteryaId].exclusiveNumbers[_number]) {
            return false;
        }
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

    function getRewardUSD() public view returns (uint) {
        (, int price, , , ) = priceFeed.latestRoundData();
        return (address(this).balance * uint(price));
    }

    function getMyNumbers(uint _loteryaId) external view returns (string[] memory) {
        return games[_loteryaId].ownersToNumbers[msg.sender];
    }

    function getRemainingNumbers(string memory _number) external view returns (uint256) {
        if (games[loteryaId].exclusiveNumbers[_number]) {
            return 10;
        } else {
            return games[loteryaId].numbersToOwners[_number].length;
        }
    }

    function getNumberIsExclusive(string memory _number) external view returns (bool) {
        return games[loteryaId].exclusiveNumbers[_number];
    }

    function isNumberAwarded(string memory _number, uint _loteryaId) external view returns (uint8) {
        if (areEqual(games[_loteryaId].winnerNumber, _number)) {
            return 1;
        } else if (areEqual(getSlice(1, 5, games[_loteryaId].winnerNumber), getSlice(1, 5, _number))) {
            return 2;              
        } else if (areEqual(getSlice(2, 5, games[_loteryaId].winnerNumber), getSlice(2, 5, _number))) {
            return 3;              
        } else if (areEqual(getSlice(3, 5, games[_loteryaId].winnerNumber), getSlice(3, 5, _number))) {
            return 4;
        } 
        return 0;
    }

    receive() external payable {}

    fallback() external payable {}
}
