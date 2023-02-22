import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import styles from '../../../styles/Footer.module.css'

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div>
        <div className={styles.block}>
          <img
            src="/linkedin.svg"
            width="25"
            height="25"
            className={styles.icon}
          />
          <h4 className={styles.name}>Linkedin</h4>
        </div>
        <div className={styles.block}>
          <img
            src="/instagram.svg"
            width="25"
            height="25"
            className={styles.icon}
          />
          <h4 className={styles.name}>Instagram</h4>
        </div>
        <div className={styles.block}>
          <img
            src="/tiktok.svg"
            width="25"
            height="25"
            className={styles.icon}
          />
          <h4 className={styles.name}>Tiktok</h4>
        </div>
      </div>
      <div className={styles.block_logo}>
        <h4 className={styles.brand}>Four-Leaf</h4>
      </div>
    </div>
  )
}