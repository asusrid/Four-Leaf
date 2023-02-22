import React from 'react'
import Web3Modal from 'web3modal'
import { useEffect, useRef, useState } from 'react'
import { Contract, providers, utils } from 'ethers'
import styles from '../../../styles/Navbar.module.scss'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router, Route, Redirect, Switch, useNavigate } from 'react-router-dom'


const NavbarMenu = ({ typeNavbar }) => {

  const [walletConnected, setWalletConnected] = useState(false);
  const [colorChange, setColorChange] = useState(false);

  const web3ModelRef = useRef();
  // const navigate = useNavigate();


  const getProviderOrSigner = async (needSigner = false) => {

    const provider = await web3ModelRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // const { chainId } = await web3Provider.getNetwork();
    // if (chainId != 5) {
    //   window.alert("Please switch to the Goerli network!");
    //   throw new Error("Incorrect network");
    // }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  }

  const connectWallet = async () => {
    try {
      web3ModelRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false
      });

      await getProviderOrSigner();
      setWalletConnected(true);

    } catch (error) {
      console.log(error);
    }
  }

  const changeNavbarColor = () => {
    if (window.scrollY >= 500) {
      setColorChange(true);
    }
    else {
      setColorChange(false);
    }
  };

  const setFinalNavbar = () => {
    if (walletConnected) {
      if (typeNavbar == "homepage") {
        return (
          <Nav className={styles.navbar_myaccount}>
            <Nav.Link href="/myaccount" className={styles.my_account}>
              {/* <img
                href="/"
                src="/profile2.svg"
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />&ensp; */}
              My Account
            </Nav.Link>
          </Nav>
        );
      } else {
        return (
          <Nav className={styles.navbar_myaccount}>
            <Nav.Link href="/" className={styles.homepage_button}>
              <span>Back to homepage</span>
            </Nav.Link>
          </Nav>
        );
      }
    } else {
      if (typeNavbar == "homepage") {
        return (
          <Nav>
            <Button className={colorChange ? styles.connect_btn_dark : styles.connect_btn}
              variant="outline-success"
              onClick={connectWallet}>
              Connect Wallet
            </Button>
          </Nav>
        );
      } else {
        return (
          <Nav>
            <Nav.Link href="/" className={styles.homepage_button}>
              <span>Back to homepage</span>
            </Nav.Link>
            <Button className={colorChange ? styles.connect_btn_dark : styles.connect_btn}
              variant="outline-success"
              onClick={connectWallet}>
              Connect Wallet
            </Button>
          </Nav>
        );
      }
    }
  }

  // doing the effect of a componentDidMount
  useEffect(() => {

    window.addEventListener('scroll', changeNavbarColor);

    window.ethereum.on("accountsChanged", async function (accounts) {
      if (!accounts.length) {
        setWalletConnected(false);
      } else {
        setWalletConnected(true);
      }
    });

  }, [])

  useEffect(() => {

    console.log(walletConnected);

    async function checkAccountConnected() {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length) {
        setWalletConnected(true);
        console.log(`You're connected to: ${accounts[0]}`);
      }
    }
    checkAccountConnected();

  }, [walletConnected])


  return (
    <Navbar collapseOnSelect sticky="top" expand="lg" className={colorChange ? 'navbar-dark bg-dark' : styles.no_color}>
      <Container>
        <Navbar.Brand className='navbar-brand center-brand' href="#home">
          <img
            src="/logo2.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
          <span className={styles.brand_name}>&ensp; Four-Leaf</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {typeNavbar == "personal"
              ? <></>
              : <>
                <Nav.Link className={styles.link} href="#home">Home</Nav.Link>
                <Nav.Link className={styles.link} href="#about-us">About us</Nav.Link>
                <Nav.Link className={styles.link} href="#last-drawings">Last drawings</Nav.Link>
                <Nav.Link className={styles.link} href="#bet-number">Play</Nav.Link>
                <Nav.Link className={styles.link} href="#step-by-step">Step by step</Nav.Link>
              </>
            }
          </Nav>
          {setFinalNavbar()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarMenu