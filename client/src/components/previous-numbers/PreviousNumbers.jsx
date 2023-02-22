import React from 'react'
import { Contract, providers } from 'ethers'
import { LOTERYA_CONTRACT_ADDRESS, ABI } from '../../../constants'
import { useEffect, useRef, useState } from 'react'
import Web3Modal from 'web3modal'
import styles from '../../../styles/PreviousNumbers.module.css'
import Accordion from 'react-bootstrap/Accordion';
import Placeholder from 'react-bootstrap/Placeholder';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button'

export default function MyAccount() {

  const [loteryaIdToNumbers, setLoteryaIdToNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const web3ModelRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {

    web3ModelRef.current = new Web3Modal({
      network: "mumbai",
      providerOptions: {},
      disableInjectedProvider: false
    });

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

  const getTimestampDraw = async (loterya, loteryaId) => {
    const filter = loterya.filters.RequestFulfilled(loteryaId.toString(), null, null);
    const events = await loterya.queryFilter(filter, 31236089, 'latest');
    const event = events[0];
    return (await event.getBlock(event.blockNumber)).timestamp * 1000;
  }
  
  const getPreviousNumbers = async () => {
    try {
      setIsLoading(true);

      const signer = await getProviderOrSigner(true);
      const loterya = new Contract(LOTERYA_CONTRACT_ADDRESS, ABI, signer);

      const currentLoteryaId = Number(await loterya.loteryaId());
      var loteryaId = 0;
      if (currentLoteryaId > 10) {
        loteryaId = currentLoteryaId - 10;
      }

      var dateToNumbers = {};
      for (loteryaId + 1; loteryaId <= currentLoteryaId; loteryaId++) {
        const numbers = await loterya.getMyNumbers(loteryaId);
        const numberToTimesBought = {};
        if (numbers.length != 0) {
          var prevNum = "0";
          for (var i = 0; i < numbers.length; i++) {
            var betNumber = numbers[i].toString().padStart(6, "0");
            if (prevNum === betNumber) {
              if (numberToTimesBought[prevNum] != "Exclusive") {
                numberToTimesBought[betNumber] += 1;
              }
            } else {
              prevNum = betNumber;
              if (await loterya.getNumberIsExclusive(betNumber)) {
                numberToTimesBought[betNumber] = "Exclusive";
              } else {
                if (numberToTimesBought[betNumber]) {
                  numberToTimesBought[betNumber] += 1;
                } else {
                  numberToTimesBought[betNumber] = 1;
                }
              }
            }
          }

          if (loteryaId == currentLoteryaId) {
            const todayTimeDraw = getMyDate(Date.now());
            dateToNumbers[todayTimeDraw] = numberToTimesBought;
          } else {
            const timestamp = await getTimestampDraw(loterya, loteryaId);
            const timeDraw = getMyDate(timestamp);
            dateToNumbers[timeDraw] = numberToTimesBought;
          }
        }
      }
      setLoteryaIdToNumbers(Object.entries(dateToNumbers));
      setIsLoading(false);

    } catch (error) {
      console.log(error);
      window.alert("There was an error getting raffles");
    }
  }

  const getMyDate = (date) => {
    var myDate = new Date(parseInt(date));
    return myDate.getDate() +
      "/" + (myDate.getMonth() + 1) +
      "/" + myDate.getFullYear()
  };

  const setNumberHtml = (numbers) => {
    var resHtlm = [];
    Object.entries(numbers).forEach(([number, times]) => {
      if (times == "Exclusive") {
        resHtlm.push(
          <p key={number}>{number} <strong>({times} 👑)</strong></p>
        );
      } else {
        resHtlm.push(
          <p key={number}>{number} (x{times} times)</p>
        );
      }

    });
    return resHtlm;
  }

  useEffect(() => {

    async function setPreviousNumbers() {
      await getPreviousNumbers();
    }
    setPreviousNumbers();

  }, []);

  return (
    <>
      <p className={styles.previousNums_intro}>
        Here you can see your numbers for the current drawing and the 10 previous ones.
      </p>
      <Accordion className={styles.previousNums_accordion}>
        {
          isLoading
            ?
            <>
              <Accordion.Item eventKey='0'>
                <Accordion.Header>
                  <Placeholder className="w-75" />
                </Accordion.Header>
                <Accordion.Body>
                  <Placeholder className="w-75" />
                </Accordion.Body>
              </Accordion.Item>
              <div className={styles.spinner}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            </>
            : loteryaIdToNumbers.length == 0
              ? <p className='text-center text-danger fst-italic'>You haven't puchased any number in the last 10 drawings</p>
              : loteryaIdToNumbers.map((item, index) => (
                <Accordion.Item key={index} eventKey={index}>
                  <Accordion.Header>
                    Drawing {item[0]}
                  </Accordion.Header>
                  <Accordion.Body>
                    <>
                      <p>You bought the following numbers for this drawing:</p>
                      {setNumberHtml(item[1])}
                    </>
                  </Accordion.Body>
                </Accordion.Item>
              ))
        }
      </Accordion >
    </>
  )
}