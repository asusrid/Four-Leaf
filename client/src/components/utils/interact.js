import { CONTRACT_ADDRESS, ABI } from '../../../constants';
import Alert from 'react-bootstrap/Alert';

const ethers = require("ethers");

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
    CONTRACT_ADDRESS
  )
};

export const getProviderOrSigner = async (needSigner = false) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const { chainId } = await provider.getNetwork();
  if (chainId != 137) {
    throw new Error("E07");
  }

  if (needSigner) {
    const signer = provider.getSigner();
    return signer;
  }

  return provider;
}

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({ method: "eth_requestAccounts" });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId != 137) {
        return {
          status: "error",
          message: getErrorMessage("E07")
        };
      } else {
        return {
          status: "success",
          message: addressArray[0]
        };
      }
    } catch (error) {
      return error;
    }
  } else {
    return {
      status: "error",
      message: (
        <p>
          In order to use this app, you must install a wallet in your browser. {' '}
          <Alert.Link target="_blank" href={`https://metamask.io/download`}>
            Simply click here to know how!
          </Alert.Link>
        </p>
      )
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({ method: "eth_accounts" });
      if (addressArray.length > 0) {
        return {
          status: "success",
          message: addressArray[0]
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  } else {
    return {
      status: "error",
      message: (
        <p>
          In order to use this app, you must install a wallet in your browser. {' '}
          <Alert.Link target="_blank" href={`https://metamask.io/download`}>
            Simply click here to know how!
          </Alert.Link>
        </p>
      )
    };
  }
};

export const getErrorMessage = (error) => {

  const errorString = error.toString();
  var message;

  if (errorString.includes("E01")) {
    message = <p> You don't have enough funds to buy a number. If you
      don't know how to get MATICs, <Alert.Link href="#instructions">here we help you.</Alert.Link>" </p>;
  } else if (errorString.includes("E02")) {
    message = <p>This drawing is finished!</p>;
  } else if (errorString.includes("E03")) {
    message = <p>This number is already in exclusivity... Try buying another one!</p>;
  } else if (errorString.includes("E04")) {
    message = <p>This number has been purchased by another user so you cannot ask for exclusivity... maybe choose another one?</p>;
  } else if (errorString.includes("E05")) {
    message = <p>There was an error buying the number.</p>;
  } else if (errorString.includes("E06")) {
    message = <p>There isn't more available numbers like this to buy... Try choosing another one! </p>;
  } else if (errorString.includes("E07")) {
    message = <p>Connect Metamask to Polygon network please. If you
      don't know how, <Alert.Link href="#instructions">here we help you.</Alert.Link>" </p>;
  } else if (errorString.includes("user rejected transaction")) {
    message = <p>You rejected the transaction.</p>;
  } else {
    message = <p>There has been an error, try again!</p>;
  }

  return message;
}