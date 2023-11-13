import { BetNumber, Reward, Navbar, LastRaffles, Instructions, Questions, Footer, Prizes } from '../src/components';
import styles from '../styles/Home.module.css'
// import { navbarStyles } from '../styles/Navbar.css'

export default function Home() {
  return (
    <div className={styles.background_color}>
      <Navbar typeNavbar="homepage" />
      <main className={styles.main}>
        <Reward />
        <div id='mission'>
          <Questions />
        </div>
        <div id='play'>
          <BetNumber />
        </div>
        <div id='prizes'>
          <Prizes />
        </div>
        <div id='drawings'>
          <LastRaffles />
        </div>
        <div id='steps'>
          <Instructions />
        </div>
      </main>
      <Footer />
    </div>
  );
}