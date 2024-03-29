import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { MyAccount, Navbar, Footer } from '../src/components';
import { connectWallet } from "../src/components/utils/interact";

export default function UserAccount() {

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

  return (
    <div className={styles.background_color}>
      <Navbar typeNavbar="personal" />
      <main className={styles.main}>
        {!walletConnected
          ? <p className={styles.wallet_message}>{message}</p>
          : <MyAccount />
        }
      </main>
      <Footer />
    </div>
  );
}