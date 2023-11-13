import React from 'react'
import styles from '../../../styles/Instructions.module.scss'

const Instructions = () => {
  return (
    <div className={styles.instructions}>
      <p className={styles.instructions_title}>Step by Step</p>
      <div className={styles.instructions_step_block}>
        <div className={styles.instructions_step}>
          <h5 className={styles.number_title}>1.</h5>{' '}
          <h4 className={`${styles.step_title}`}>Connect your wallet</h4>
        </div>
        <p className={`${styles.instructions_step_text}`}>
          We are using {' '}
          <a className={styles.underlined} href='https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-started-with-MetaMask'>Metamask</a>
          {' '} wallet so, first of all, connect the one you prefer to start betting. If you don't have it installed, you can use the link above.
        </p>
      </div>
      <div className={styles.instructions_step_block}>
        <div className={styles.instructions_step}>
          <h5 className={styles.number_title}>2.</h5>{' '}<h4 className={`${styles.step_title}`}>Connect to Polygon</h4>
        </div>
        <p className={`${styles.instructions_step_text}`}>
          This Dapp is deployed on the Polygon mainnet and, for this reason, you must connect to that network. Simply, {' '}
          <a className={styles.underlined} href='https://polyrhino-finance.gitbook.io/poly-rhino-whitepaper/guides/setup-polygon-matic-mainnet-on-metamask'>follow this
            fast tutorial</a> {' '} in case you haven't configured it yet in Metamask
        </p>
      </div>
      <div className={styles.instructions_step_block}>
        <div className={styles.instructions_step}>
          <h5 className={styles.number_title}>3.</h5>{' '}
          <h4 className={`${styles.step_title}`}>Get your MATICs</h4>
        </div>
        <div className={`${styles.instructions_step_text}`}>
          <p>
            In order to submit payments as well as to receive prizes, we will use the native
            coin of Polygon, MATIC. This is why you should have enough of them in your account to bet on a number. 
            To buy MATICs, there are multiple options, so choose
            the one you prefer 😉:
          </p>
          <ul>
            <li>
              There is a really cool feature Polygon has included, {' '}
              <a className={styles.underlined} href='https://polygon.technology/blog/swap-for-gas-get-matic-token-on-polygon-pos-in-a-flash'>Swap for Gas</a>🪄.
              If you have tokens (ETH, Bitcoin, USDT, etc.) and you want to change those for MATICs without paying gas fees, you can {' '}
              <a className={styles.underlined} href='https://wallet.polygon.technology/polygon/gas-swap'>use this method!</a>
            </li>
            <li>
              In case you don't have any token, you can use all the possible exchangers there are in the market like <a className={styles.underlined} href='https://www.binance.com'>Binance</a>, {' '}
              <a className={styles.underlined} href='https://www.coinbase.com'>Coinbase</a>, etc., to get MATICs in exchange of Euros, Dolars, etc.
              Then, you'll have to transfer those MATICs from the exchanger to your account in Metamask.
            </li>
            <li>
              Finally, another possibility is to change FIAT (euros, dolars, etc.) for MATICs using apps like {' '}
              <a className={styles.underlined} href='https://ramp.network/buy/'>Ramp</a>. 💡This is a good option in case you don't have an account in an exchanger
              and you want your MATICs directly in your Metamask account. The downside of this app are fees.
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.instructions_step_block}>
        <div className={styles.instructions_step}>
          <h5 className={styles.number_title}>4.</h5>{' '}
          <h4 className={`${styles.step_title}`}>Ready to play!</h4>
        </div>
        <p className={`${styles.instructions_step_text}`}>
          Once you have MATICs in your account, now it's time for you to play!! There are 3
          ways to bet on a number: One of them is simply buy a number for 2 USD among the 10 possible ones.
          The other way is to buy the exclusivity of that number, which means that nobody else can buy it, for
          18 USD. The final way depends on your strategy, maybe you don't want to buy the full exclusivity, but
          you feel that number can give you luck, so you can buy more than once that number.
          <br></br>
          <br></br>
          Anyway, bear in mind that there is no limit about how many numbers a user can buy. We let you make this decision.
        </p>
      </div>
      <div className={styles.instructions_step_block}>
        <div className={styles.instructions_step}>
          <h5 className={styles.number_title}>5.</h5>{' '}
          <h4 className={`${styles.step_title}`}>Wait for the draw</h4>
        </div>
        <p className={`${styles.instructions_step_text}`}>
          Now, take a coffee and relax 🍵, you have already done everything on your part. Drawings are held every
          Monday, at 00.00 UTC.
        </p>
      </div>
      <div className={styles.instructions_step_block}>
        <div className={styles.instructions_step}>
          <h5 className={styles.number_title}>6.</h5>{' '}
          <h4 className={`${styles.step_title}`}>Time to receive your prize!</h4>
        </div>
        <p className={`${styles.instructions_step_text}`}>
          If you have a winning number, CONGRATULATIONS!!🎉 As you may remember, each number can be bought 10
          times, which means that another 10 people could have bought it too, unless you have bought the
          exclusivity of that number, in which case you are the only owner of it. Prizes are distributed among
          the owners of the winning number. So, if you were the only one who bought it or you have the exclusivity,
          the whole prize is yours. However, if there was 5 more purchasers, then the prize is distributed
          proportionally. Furthermore, 1% of the total amount accumulated will remain in this app contract's address for 
          next draw.
        </p>
      </div>
    </div>
  )
}

export default Instructions