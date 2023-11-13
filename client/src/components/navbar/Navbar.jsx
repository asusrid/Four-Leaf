import React from 'react';
import { useEffect, useState } from 'react';
import { connectWallet, getCurrentWalletConnected } from "../utils/interact";
import styles from '../../../styles/Navbar.module.scss';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavbarMenu = ({ typeNavbar }) => {

  const [walletConnected, setWalletConnected] = useState(false);
  const [colorChange, setColorChange] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [message, setMessage] = useState('');

  const setupWallet = async () => {
    const accountConnected = await connectWallet();
    if (accountConnected.status === "success") {
      setWalletConnected(true);
    } else {
      setIsError(true);
      setMessage(accountConnected.message);
    }
  }

  const getDangerAlert = (message) => {
    setTimeout(() => {
      setIsError(false)
    }, 6000);
    return (
      <Alert className={styles.alert} variant="danger" onClose={() => setIsError(false)} dismissible>
        <Alert.Heading>Ups! There was something wrong 😅</Alert.Heading>
        {message}
      </Alert>
    )
  }

  const getWarningAlert = (message) => {
    setTimeout(() => {
      setIsWarning(false)
    }, 8000);
    return (
      <Alert className={styles.alert} variant="warning" onClose={() => setIsWarning(false)} dismissible>
        <Alert.Heading>We have one thing to tell you 🙄</Alert.Heading>
        {message}
      </Alert>
    )
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
              onClick={setupWallet}>
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
              onClick={setupWallet}>
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

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async function (accounts) {
        if (!accounts.length) {
          setWalletConnected(false);
        } else {
          setWalletConnected(true);
        }
      });
    }

    async function getCurrentAccount() {
      const accountConnected = await getCurrentWalletConnected();
      if (accountConnected.status === "success") {
        if (accountConnected) {
          setWalletConnected(true);
          console.log(`You're connected to: ${accountConnected.message}`);
        } else {
          setWalletConnected(false);
        }
      } else if (accountConnected.status === "error") {
        setIsWarning(true);
        setMessage(accountConnected.message);
      }
    }
    getCurrentAccount();

  }, [])

  return (
    <Navbar collapseOnSelect sticky="top" expand="lg" className={colorChange ? 'navbar-dark bg-dark' : styles.no_color}>
      <Container>
        <Navbar.Brand className='navbar-brand center-brand' href="#home">
          <img
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Four-Leaf logo"
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
                <Nav.Link className={styles.link} href="#mission">Our mission</Nav.Link>
                <Nav.Link className={styles.link} href="#play">Play</Nav.Link>
                <Nav.Link className={styles.link} href="#prizes">Prizes</Nav.Link>
                <Nav.Link className={styles.link} href="#drawings">Last drawings</Nav.Link>
                <Nav.Link className={styles.link} href="#steps">Step by step</Nav.Link>
              </>
            }
          </Nav>
          {setFinalNavbar()}
        </Navbar.Collapse>
      </Container>
      {
        isError
          ? getDangerAlert(message)
          : <></>
      }
      {
        isWarning
          ? getWarningAlert(message)
          : <></>
      }
    </Navbar>
  )
}

export default NavbarMenu