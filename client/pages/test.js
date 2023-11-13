import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { PreviousNumbers, Navbar, Footer } from '../src/components';
import { connectWallet, getProviderOrSigner } from "../src/components/utils/interact";
import Button from 'react-bootstrap/Button';
const ethers = require("ethers");
import { CONTRACT_ADDRESS, ABI } from '../constants';

export default function MyAccount() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {

    ethereum.on('chainChanged', handleChainChanged);
    function handleChainChanged(_chainId) {
      window.location.reload();
    }

    window.ethereum.on("accountsChanged", async function (accounts) {
      if (!accounts.length) {
        setWalletConnected(false);
        setMessage('Connect your wallet or return home');
      } else {
        setWalletConnected(true);
      }
    });

    const setupWallet = async () => {
      const accountConnected = await connectWallet();
      if (accountConnected.status === "success") {
        setWalletConnected(true);
      } else {
        setMessage('Connect Metamask to Polygon network. We show you how to do this in our homepage 😉');
      }
    }
    setupWallet();
  }, [])

  const interleaved = async () => {
    const signer = await getProviderOrSigner(true);
    const loterya = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    
    const res5 = await loterya.getBalance();
    console.log("Last 5 > ", Number(res5));
  }

  return (
    <div className={styles.background_color}>
      <Navbar typeNavbar="personal" />
      <main className={styles.main}>
        {!walletConnected
          ? <p className={styles.wallet_message}>{message}</p>
          : <PreviousNumbers />
        }
        <Button onClick={interleaved}>checkInterleaved</Button>
      </main>
      <Footer />
    </div>
  );
}