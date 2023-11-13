import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import styles from '../../../styles/Footer.module.css'

export default function Footer() {
  return (
    <div className={styles.footer}>
      <p className={styles.summary}>Decentralized lottery application deployed on Polygon mainnet.</p>
      <div className={styles.second_row}>
        <div className={styles.social_media}>
          <div className={styles.block}>
            <a className={styles.social_link} href='https://www.linkedin.com/company/four-leaf-lottery'>
              <img
                src="/linkedin.svg"
                width="25"
                height="25"
                className={styles.icon}
              />
            </a>
          </div>
          <div className={styles.block}>
            <a className={styles.social_link} href='https://instagram.com/fourleaflottery?igshid=ZDdkNTZiNTM='>
              <img
                src="/instagram.svg"
                width="25"
                height="25"
                className={styles.icon}
              />
            </a>
          </div>
          <div className={styles.block}>
            <a className={styles.social_link} href='https://www.tiktok.com/@fourleaflottery?_t=8a73YdulGEv&_r=1'>
              <img
                src="/tiktok.svg"
                width="25"
                height="25"
                className={styles.icon}
              />
            </a>
          </div>
        </div>
        <div className={styles.block_logo}>
          <h4 className={styles.brand}>Four-Leaf</h4>
        </div>
      </div>
    </div>
  )
}