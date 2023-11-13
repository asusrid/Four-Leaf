import React from 'react'
import styles from '../../../styles/Questions.module.scss'
import { useEffect, useState } from 'react'

const Questions = () => {

  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  })

  return (
    <div className={styles.questions}>
      <div>
        <div className={styles.questions_step}>
          <h4 className={styles.questions_title}>What is Four-Leaf?</h4>
          <br className={styles.line_break}></br>
          <img
            src="/four_leafs2.svg"
            width="43"
            height="43"
            className={styles.question_image_position}
          />
        </div>
        <p className={styles.questions_text}>
          <strong>Four-Leaf is an independent lottery Dapp designed for people and controlled by people. </strong>
          Independent since it's deployed and verified on a Blockchain network, Polygon,
          not responding to any central authority, and our winning numbers are chosen in a
          transparent and random way using decentralized Oracles.
          <strong>{' '}Run by people, the more people use it, the higher the prizes will be.</strong>
        </p>
      </div>
      <div>
        <div className={styles.questions_step}>
          <h4 className={styles.questions_title}>Why using this Dapp?</h4>
          <br className={styles.line_break}></br>
          <img
            src="/bell.svg"
            width="43"
            height="43"
            className={styles.question_image_position}
          />
        </div>
        {
          isMobile
            ? <p className={styles.questions_text}>
              Traditional lottery systems have a number of drawbacks: cases of <strong>fraud/corruption</strong>, procedures are
              <strong> opaque</strong>, they are <strong>subject to authorities and regulations</strong>, <strong>lack of ownership</strong> in case
              of loss or theft of your number or <strong> very high taxes</strong>. With the help of Blockchain, we solve all this and offer this investment 
              opportunity with <a className={styles.underlined} href='#prizes'>multiple ways to win prizes.</a>{' '}
              <strong>As we say, trust technology, not people.</strong>
            </p>
            : <p className={styles.questions_text}>
              Traditional lottery systems have a number of drawbacks: cases of <strong>fraud/corruption</strong>, procedures are
              <strong> opaque</strong>, they are <strong>subject to authorities and regulations</strong> and <strong>lack of ownership</strong> in case
              of loss or theft of your number.
              <br></br>
              <br></br>
              This is an investment opportunity that, by using Blockchain, solves all these problems, <strong> with non-existent or reduced
                taxes, and with no control from institutions like banks or governments. </strong>
              <strong> You receive your prize automatically in your wallet in seconds, regardless of your location, and we even offer {' '}
              <a className={styles.underlined} href='#prizes'>multiple prizes!</a></strong>
              <br></br>
              <br></br>
              <strong>As we say, trust technology, not people.</strong>
            </p>
        }
      </div>
      <div>
        <div className={styles.questions_step}>
          <h4 className={styles.questions_title}>How can I start?</h4>
          <br className={styles.line_break}></br>
          <img
            src="/route.svg"
            width="45"
            height="45"
            className={styles.question_image_position}
          />
        </div>
        <p className={styles.questions_text}>
          Simply, follow <span className={styles.steps_standout}><strong>these 4 steps:</strong></span>
        </p>
        <ol className={styles.questions_text}>
          <li>Connect your Metamask wallet</li>
          <li><a className={styles.underlined} href='#play'>Bet on a number(s)</a></li>
          <li>Wait for the draw</li>
          <li>Enjoy your prize 🎉</li>
          <li>And repeat!</li>
        </ol>
        <p className={styles.questions_text}>
          <a className={styles.underlined} href='#steps'>Here we give you more details.</a>
        </p>

      </div>
    </div>
  )
}

export default Questions