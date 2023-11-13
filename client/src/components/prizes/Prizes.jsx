import React from 'react';
import styles from '../../../styles/Prizes.module.scss';

export default function Prizes() {

  return (
    <div className={styles.prizes}>
      <p className={styles.title}>Prizes</p>
      <div className={styles.content}>
        <div className={styles.first}>
          <p className={styles.first_prize_title}>1st Prize 👑</p>
          <p className={styles.prize_text}>
            This prize is only for those who purchased the complete correct number. These players will be awarded with 94% of
            the total amount, which means a prize of $9,400 for a total quantity of $10,000.
          </p>
        </div>
        <div className={styles.other_prizes}>
          <div className={styles.another_prize_text}>
            <p className={styles.prize_title}>2nd Prize 🥈</p>
            <p className={styles.prize_text}>
              It's not an all-or-nothing game, there are second chances here 😉. If you have the last 5 digits of the winning
              number, you'll be awarded with 3% of the total amount accumulated, $300.
            </p>
          </div>
          <div className={styles.another_prize_text}>
            <p className={styles.prize_title}>3rd Prize 🥉</p>
            <p className={styles.prize_text}>
              On the other hand, if the last 4 digits of your number are the same as the winning number, then 2% of the total
              amount will be yours. This means $200 for the previous total amount.
            </p>
          </div>
          <div className={styles.another_prize_text}>
            <p className={styles.prize_title}>4th Prize</p>
            <p className={styles.prize_text}>
              Finally, if you only have half of the digits correct, that is, the last 3 digits, then 1% of the total amount is yours,
              which is $100.
            </p>
          </div>
        </div>
        <div className={styles.first}>
          <p className={styles.prize_text_info}>
            These quantities are assuming an accumulated amount of $10,000, but this is just an example. More details about {' '}
            <a className={styles.underlined} href='#steps'>how prizes are distributed here, section 6.</a>
          </p>
        </div>
      </div>
    </div>
  );
}