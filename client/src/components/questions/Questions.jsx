import React from 'react'
import styles from '../../../styles/Questions.module.css'

const Questions = () => {
  return (
    <div className={styles.questions}>
      <div className={styles.questions_block_crown}>
        <div className={styles.questions_step}>
          <h4 className={styles.questions_title}>What is Four-Leafs?</h4>
          <img
            src="/four_leafs2.svg"
            width="43"
            height="43"
            className={styles.question_image_position}
          />
        </div>
        <p className={styles.questions_text}>
          <strong>Four-Leafs is an independent lottery Dapp designed for people and controlled by people. </strong>
          Independent because it's deployed on a Blockchain network, Polygon,
          not responding to any central authority, and our winning numbers are chosen in a
          transparent and random way using decentralized Oracles.
          <strong>The power lies with the people who use it, as more people use it, the higher the prizes
            will be.</strong>
        </p>
      </div>
      <div className={styles.questions_block_location}>
        <div className={styles.questions_step}>
          <h4 className={styles.questions_title}>Why using this Dapp?</h4>
          <img
            src="/bell.svg"
            width="43"
            height="43"
            className={styles.question_image_position}
          />
        </div>
        <p className={styles.questions_text}>
          <strong>Let's answer this question with more questions</strong>: Do you really trust how traditional lottery
          systems work? 100% no fraud/corruption guarantee? Why do you have
          to wait some days or go physically to a bank to earn a prize? Why are there situations in
          which the ownership of a winning number is not clear? Two examples: Multiple people, maybe
          friends or family, claiming a part of the prize when it was YOU alone who bought it.
          And second example: If you loose or your number is stolen, how do you proof that number is yours?
          Surprinsingly, Blockchain solves all these problems. <strong>As we say, trust technology, not people.</strong>
        </p>
      </div>
      <div className={styles.questions_block_different}>
        <div className={styles.questions_step}>
          <h4 className={styles.questions_title}>Why Blockchain?</h4>
          <img
            src="/chain.svg"
            width="43"
            height="43"
            className={styles.question_image_position}
          />
        </div>
        <p className={styles.questions_text}>
          This is the key question. We use Blockchain for several reasons:
          instantaneity, transparency and automation. <strong>Instantaneity</strong> because all
          prizes are earned by users
          in a matter of seconds, regardless of your location. <strong>Automation</strong> since all
          payments are done automatically without human interaction.
          Finally, <strong>transparency</strong>, all our users can analyse
          how prizes are shared or how numbers are chosen by reading the source code of the smart contract
          this Dapp is based on.
          <br></br>
          <br></br>
          Last thing! We have a dedicated section for you to know exactly <a href='#instructions'>how to start using this Dapp</a>, we have
          taken care to make it clear to everyone 😘.
        </p>
      </div>
    </div>
  )
}

export default Questions