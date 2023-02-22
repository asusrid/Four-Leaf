import { Contract, providers, utils } from 'ethers'
import { LOTERYA_CONTRACT_ADDRESS, ABI } from '../../../constants'
import styles from '../../../styles/BetNumber.module.css'
import { useEffect, useRef, useState } from 'react'
import Web3Modal from 'web3modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';


export default function BetNumber() {

  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [number3, setNumber3] = useState('');
  const [number4, setNumber4] = useState('');
  const [number5, setNumber5] = useState('');
  const [number6, setNumber6] = useState('');
  const [remainingNumbers, setRemainingNumbers] = useState(null);
  const [numbersProvided, setNumbersProvided] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasBought, setHasBought] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alert, setAlert] = useState(null);

  const web3ModelRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {

    web3ModelRef.current = new Web3Modal({
      network: "polygon",
      providerOptions: {},
      disableInjectedProvider: false
    });

    const provider = await web3ModelRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // const { chainId } = await web3Provider.getNetwork();
    // if (chainId != 137) {
    //   setIsError(true);
    //   showError("E07")
    //   throw new Error("Incorrect network");
    // }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  }

  const showError = (error) => {

    const errorString = String(error);

    if (errorString.includes("E01")) {
      var message = <p> You don't have enough funds to buy a number. If you
        don't know how to get MATICs, <Alert.Link href="#instructions">here we help you.</Alert.Link>" </p>;
    } else if (errorString.includes("E02")) {
      var message = <p>This drawing is finished!</p>;
    } else if (errorString.includes("E03")) {
      var message = <p>This number is already in exclusivity... Try buying another one!</p>;
    } else if (errorString.includes("E04")) {
      var message = <p>This number has been purchased by another user so you cannot ask for exclusivity... maybe choose another one?</p>;
    } else if (errorString.includes("E05")) {
      var message = <p>There was an error buying the number.</p>;
    } else if (errorString.includes("E06")) {
      var message = <p>There isn't more available numbers like this to buy... Try choosing another one! </p>;
    } else if (errorString.includes("E07")) {
      var message = <p>Connect Metamask to Polygon network in order to bet on a number, please. If you
        don't know how, <Alert.Link href="#instructions">here we help you.</Alert.Link>" </p>;
    } else if (errorString.includes("user rejected transaction")) {
      var message = <p>You rejected the transaction on Metamask.</p>;
    } 
    // else {
    //   if (error.data.message.includes("insufficient funds")) {
    //     var message = <p>Metamask says there is insufficient funds for gas + price + value.</p>;
    //   }
    // }
    setAlert(getAlert(message));
  }

  const getAlert = (message) => {
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

  const getSuccess = () => {
    setTimeout(() => {
      setHasBought(false)
    }, 6000);
    return (
      <Alert className={styles.alert} variant="success" onClose={() => setHasBought(false)} dismissible>
        <Alert.Heading>Great! 😁 Your transaction has been confirmed.</Alert.Heading>
        <p>
          Now you have to simply wait and let luck play its part, unless you want to increase your chances
          and buy more numbers!
        </p>
      </Alert>
    )
  }

  const getButtons = () => {
    return (
      <Row className='ms-0 me-0 justify-content-center'>
        <Button value='bet-number' onClick={handleOnSubmit} className={styles.form_bet_button} disabled={!allNumbersValid() || remainingNumbers == "" || remainingNumbers == null}>
          Bet Number
        </Button>
        <Button value='get-all' onClick={handleOnSubmit} className={styles.form_bet_button} disabled={!allNumbersValid() || remainingNumbers == "" || remainingNumbers == null}>
          Get Exclusivity
        </Button>
      </Row>
    )
  }

  const getNumber = async (exclusivity = false) => {
    try {

      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const loterya = new Contract(LOTERYA_CONTRACT_ADDRESS, ABI, signer);
      const betNumber = (number1 + number2 + number3 + number4 + number5 + number6).padStart(6, "0");

      if (exclusivity) {
        const price = await loterya.getLatestPrice(true);
        const res = await loterya.getExclusivity(betNumber, { value: price });
        await res.wait();
      } else {
        const price = await loterya.getLatestPrice(false);
        const res = await loterya.betNumber(betNumber, { value: price });
        await res.wait();
      }

      setHasBought(true);
      setLoading(false);

    } catch (error) {
      setIsError(true);
      showError(error);
      setLoading(false);
      console.log(error);
    }
  }

  const getRemainingNumbers = async () => {
    try {
      const provider = await getProviderOrSigner();
      const loterya = new Contract(LOTERYA_CONTRACT_ADDRESS, ABI, provider);
      const betNumber = (number1 + number2 + number3 + number4 + number5 + number6).padStart(6, "0");
      const purchasedNumbers = await loterya.getRemainingNumbers(betNumber);
      const remaining = 10 - purchasedNumbers;
      setRemainingNumbers(String(remaining));
    } catch (error) {
      setIsError(true);
      showError("There was an error while trying to get the remaining numbers of the selected one. Try again again please!");
      console.log(error);
    }
  }

  const allNumbersProvided = () => {
    if (number1 == null || number1 == ''
      || number2 == null || number2 == ''
      || number3 == null || number3 == ''
      || number4 == null || number4 == ''
      || number5 == null || number5 == ''
      || number6 == null || number6 == '') {
      return false;
    }
    return true;
  }

  const allNumbersValid = () => {
    var reg = new RegExp('^[0-9]$');
    if (number1 == ' ' || !reg.test(number1)
      || number2 == ' ' || !reg.test(number2)
      || number3 == ' ' || !reg.test(number3)
      || number4 == ' ' || !reg.test(number4)
      || number5 == ' ' || !reg.test(number5)
      || number6 == ' ' || !reg.test(number6)) {
      return false;
    }
    return true;
  }

  const handleOnSubmit = event => {

    event.preventDefault();

    if (event.target.value === "bet-number") {
      getNumber(false);
    }
    if (event.target.value === "get-all") {
      getNumber(true);
    }

    setNumber1('');
    setNumber2('');
    setNumber3('');
    setNumber4('');
    setNumber5('');
    setNumber6('');
  }

  useEffect(() => {
    if (numbersProvided) {
      async function getNumbers() {
        await getRemainingNumbers();
      }
      getNumbers();
      console.log("Numbers provided");
    }
  }, [numbersProvided])

  useEffect(() => {
    if (allNumbersProvided()) {
      if (allNumbersValid()) {
        setRemainingNumbers(null);
        setNumbersProvided(true);
      }
    } else {
      setNumbersProvided(false);
      setRemainingNumbers(null);
    }
  }, [number1, number2, number3, number4, number5, number6])


  return (
    <Form className={styles.form_bet}>
      <Form.Group>
        <Form.Label className={styles.form_bet_title}>
          Bet on a number for only <br></br><span className={styles.form_bet_price}>2 USD</span>
        </Form.Label>
        <Form.Label className={styles.form_bet_label}>Enter your number</Form.Label>
        <Row className={styles.form_row}>
          <div className={styles.form_style_number}></div>
          <Col>
            <Form.Control required id="1" value={number1} className={styles.form_numbers} type="text" maxLength="1" placeholder="0" onChange={event => setNumber1(event.target.value)} />
          </Col>
          <Col>
            <Form.Control required id="2" value={number2} className={styles.form_numbers} type="text" maxLength="1" placeholder="0" onChange={event => setNumber2(event.target.value)} />
          </Col>
          <Col>
            <Form.Control required id="3" value={number3} className={styles.form_numbers} type="text" maxLength="1" placeholder="0" onChange={event => setNumber3(event.target.value)} />
          </Col>
          <Col>
            <Form.Control required id="4" value={number4} className={styles.form_numbers} type="text" maxLength="1" placeholder="0" onChange={event => setNumber4(event.target.value)} />
          </Col>
          <Col>
            <Form.Control required id="5" value={number5} className={styles.form_numbers} type="text" maxLength="1" placeholder="0" onChange={event => setNumber5(event.target.value)} />
          </Col>
          <Col>
            <Form.Control required id="6" value={number6} className={styles.form_numbers} type="text" maxLength="1" placeholder="0" onChange={event => setNumber6(event.target.value)} />
          </Col>
          <div className={styles.form_style_number}></div>
        </Row>
        {
          loading
            ?
            <div className={styles.spinner}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
            : hasBought
              ?
              <>
                {getSuccess()}
                {getButtons()}
              </>
              :
              <>
                {getButtons()}
              </>
        }
        <Row className={styles.form_bet_messages}>
          {
            remainingNumbers == null
              ? <></>
              : <Form.Label className={styles.form_remaining_number_label}>There are {remainingNumbers} remaining numbers</Form.Label>
          }
          {
            allNumbersProvided()
              ? allNumbersValid()
                ? <Form.Label>{' '}</Form.Label>
                : <Form.Label className={styles.form_error_label}>Enter valid numbers</Form.Label>
              : <></>
          }
          {
            isError
              ? <>{alert}</>
              : <></>
          }
        </Row>
      </Form.Group>
    </Form>
  )
}
