import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import styles from '../../../styles/Instructions.module.css'

const Instructions = () => {
  return (
    <div className={styles.instructions}>
      <p className={styles.instructions_title}>Step by Step</p>
      <div className={styles.instructions_step_block}>
        <div className={styles.instructions_step}>
          {/* <h4 className={`${styles.instructions_step_title} ${styles.instructions_step_title_wallet}`}>1. Connect your wallet</h4> */}
          <h5 className={styles.number_title}>1.</h5>{' '}<h4 className={`${styles.step_title}`}>Connect your wallet</h4>
          {/* <img
            src="/connect_wallet.svg"
            width="40"
            height="40"
            className={styles.instructions_image_position}
          /> */}
        </div>
        <p className={`${styles.instructions_step_text}`}>
          This website is using <a href='https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-started-with-MetaMask'>Metamask</a>
          {' '}as a wallet so, first of all, connect your wallet to start betting. You can use the link above to get it ready.
        </p>
      </div>
      <div className={styles.instructions_step_block}>
        <div className={styles.instructions_step}>
          {/* <h4 className={`${styles.instructions_step_title} ${styles.instructions_step_title_polygon}`}>2. Connect to Polygon</h4> */}
          <h5 className={styles.number_title}>2.</h5>{' '}<h4 className={`${styles.step_title}`}>Connect to Polygon</h4>
          {/* <img
            src="/polygon4.svg"
            width="55"
            height="35"
            className={styles.instructions_image_position}
          /> */}
        </div>
        <p className={`${styles.instructions_step_text}`}>
          This Dapp is deployed on the Polygon mainnet and, for this reason, you must connect to that network. Simply, {' '}
          <a href='https://polyrhino-finance.gitbook.io/poly-rhino-whitepaper/guides/setup-polygon-matic-mainnet-on-metamask'>follow this
            fast tutorial</a> {' '} in case you haven't configured it yet in Metamask
        </p>
      </div>
      <div className={styles.instructions_step_block}>
        <div className={styles.instructions_step}>
          <h5 className={styles.number_title}>3.</h5>{' '}<h4 className={`${styles.step_title}`}>Get your MATICs</h4>
          {/* <img
            src="/get_matic.svg"
            width="50"
            height="50"
            className={styles.instructions_image_position}
          /> */}
        </div>
        <div className={`${styles.instructions_step_text}`}>
          <p>
            In order to submit payments as well as to receive prizes, we will use the native
            coin of Polygon, MATIC. This is why you should have enough of them in your account to use this Dapp,
            for example, at the time of betting for a number. To buy MATICs, there are multiple options, so choose
            the one you prefer 😉:
          </p>
          <ul>
            <li>
              There is a really cool feature Polygon has included is {' '}
              <a href='https://polygon.technology/blog/swap-for-gas-get-matic-token-on-polygon-pos-in-a-flash'>Swap for Gas</a>🪄.
              If you have tokens (ETH, etc.) or USDT and you want to change those for MATICs without paying gas fees, you can {' '}
              <a href='https://wallet.polygon.technology/polygon/gas-swap'>use this method!</a>
            </li>
            <li>
              You can use all the possible exchangers there are in the market like <a href='https://www.binance.com'>Binance</a>, {' '}
              <a href='https://www.coinbase.com'>Coinbase</a>, etc., to get MATICs in exchange of ETH, Bitcoin or FIAT (euros, dolars, etc.).
              Then, you'll have to transfer those MATICs from the exchanger to your account in Metamask.
            </li>
            <li>
              Finally, another possibility is to change FIAT (euros, dolars, etc.) for MATICs using apps like {' '}
              <a href='https://ramp.network/buy/'>Ramp</a>. 💡This is a good option in case you don't have an account in an exchanger
              and you want your MATICs directly in your Metamask account.
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.instructions_step_block}>
        <div className={styles.instructions_step}>
          <h5 className={styles.number_title}>4.</h5>{' '}<h4 className={`${styles.step_title}`}>Ready to play!</h4>
          {/* <img
            src="/polygon4.svg"
            width="55"
            height="35"
            className={styles.instructions_image_position}
          /> */}
        </div>
        <p className={`${styles.instructions_step_text}`}>
          Once you have MATICs in your account, now it's time for you to play!! There are 3
          ways to bet on a number: One of them is simply buy a number for 2 USD among the 10 possible ones.
          The other way is to buy the exclusivity of that number, which means that nobody else can buy it, for
          18 USD. The final way depends on your strategy, maybe you don't want to buy the full exclusivity, but
          you feel that number can give you luck, so you can decide to buy more than once that number.
          <br></br>
          <br></br>
          Anyway, bear in mind that you can always buy as many numbers as you want,
          whether it is individually or get full exclusivity, we let you make this decision.
        </p>
      </div>
      <div className={styles.instructions_step_block}>
        <div className={styles.instructions_step}>
          <h5 className={styles.number_title}>5.</h5>{' '}<h4 className={`${styles.step_title}`}>Wait for the draw</h4>
          {/* <img
            src="/polygon4.svg"
            width="55"
            height="35"
            className={styles.instructions_image_position}
          /> */}
        </div>
        <p className={`${styles.instructions_step_text}`}>
          Now, take a coffee and relax 🍵, you have already done everything on your part. Draws are held every
          Monday, at 00.00 UTC.
        </p>
      </div>
      <div className={styles.instructions_step_block}>
        <div className={styles.instructions_step}>
          <h5 className={styles.number_title}>6.</h5>{' '}<h4 className={`${styles.step_title}`}>Time to receive your prize!</h4>
          {/* <img
            src="/polygon4.svg"
            width="55"
            height="35"
            className={styles.instructions_image_position}
          /> */}
        </div>
        <p className={`${styles.instructions_step_text}`}>
          If you have a winning number, CONGRATULATIONS!!🎉 As you may remember, each number can be bought 10
          times, which means that another 10 people could have bought it too, unless you have bought the
          exclusivity of that number, in which case you are the only owner of it. Prizes are distributed among
          the purchasers of the winning number. If you were the only one who bought it or you have the exclusitivity,
          the whole prize is yours. However, if there was 5 more purchasers, then the prize is distributed
          proportionally.
        </p>
      </div>
    </div>
  )
}

export default Instructions