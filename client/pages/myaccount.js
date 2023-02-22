import { PreviousNumbers, Reward, Navbar, Footer } from '../src/components';
import styles from '../styles/Home.module.css'
// import { navbarStyles } from '../styles/Navbar.css'
import { useEffect, useState, useRef } from 'react'


export default function MyAccount() {

  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    window.ethereum.on("accountsChanged", async function (accounts) {
      if (!accounts.length) {
        setWalletConnected(false);
      } else {
        setWalletConnected(true);
      }
    });
    async function checkAccountConnected() {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length) {
        setWalletConnected(true);
      }
    }
    checkAccountConnected();
  }, [])

  return (
    <div className={styles.background_color}>
      <Navbar typeNavbar="personal" />
      <main className={styles.main}>
        {!walletConnected
          ? <p className={styles.wallet_message}>Connect your wallet or return home</p>
          : <PreviousNumbers />
        }
      </main>
      <Footer />
    </div>
  );
}