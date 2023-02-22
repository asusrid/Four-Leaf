import { LOTERYA_CONTRACT_ADDRESS, ABI } from '../../../constants';

export const web3Provider = () => {
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    // const alchemyURL = process.env.ALCHEMY_MUMBAI_API_KEY_WSS;
    const alchemyURL = process.env.ALCHEMY_POLYGON_API_KEY_WSS;
    const web3 = createAlchemyWeb3(alchemyURL);
    return web3;
}

export const loteryaContract = () => {
    const web3 = web3Provider();
    return new web3.eth.Contract(
        ABI,
        LOTERYA_CONTRACT_ADDRESS
    )
};

export const getProvider = async () => {
    const web3 = web3Provider();
    const blockNumber = await web3.eth.getBlockNumber();
    console.log("The latest block number is " + blockNumber);
};
