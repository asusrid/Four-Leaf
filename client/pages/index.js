import { BetNumber, Reward, Navbar, LastRaffles, Instructions, Questions, Footer } from '../src/components';
import styles from '../styles/Home.module.css'
// import { navbarStyles } from '../styles/Navbar.css'

export default function Home() {
  return (
    <div className={styles.background_color}>
      <Navbar typeNavbar="homepage" />
      <main className={styles.main}>
        <Reward />
        <div id='about-us'>
          <Questions />
        </div>
        <div id='last-drawings'>
          <LastRaffles />
        </div>
        <div id='bet-number'>
          <BetNumber />
        </div>
        <div id='step-by-step'>
          <Instructions />
        </div>
      </main>
      <Footer />
    </div>
  );
}