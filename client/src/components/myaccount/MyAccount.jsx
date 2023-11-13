import React from 'react';
import { CONTRACT_ADDRESS, ABI } from '../../../constants';
import { getProviderOrSigner } from "../utils/interact";
import { useEffect, useState } from 'react';
import styles from '../../../styles/PreviousNumbers.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Placeholder from 'react-bootstrap/Placeholder';
import Spinner from 'react-bootstrap/Spinner';

export default function MyAccount() {

  const [loteryaIdToNumbers, setLoteryaIdToNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const ethers = require("ethers");

  const getTimestampDraw = async (loterya, loteryaId) => {
    const filter = loterya.filters.RequestFulfilled(loteryaId.toString(), null, null);
    // const events = await loterya.queryFilter(filter, 39592097, 'latest');
    const events = await loterya.queryFilter(filter, 32835382, 'latest');
    const event = events[0];
    return (await event.getBlock(event.blockNumber)).timestamp * 1000;
  }

  const getPreviousNumbers = async () => {
    try {
      setIsLoading(true);

      const signer = await getProviderOrSigner(true);
      const loterya = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

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
            var betNumber = numbers[i];
            if (prevNum === betNumber) {
              if (numberToTimesBought[prevNum] != "Exclusive") {
                numberToTimesBought[betNumber][0] += 1;
              }
            } else {
              prevNum = betNumber;
              if (await loterya.getNumberIsExclusive(betNumber)) {
                numberToTimesBought[betNumber] = [];
                numberToTimesBought[betNumber][0] = "Exclusive";
              } else {
                if (numberToTimesBought[betNumber]) {
                  numberToTimesBought[betNumber][0] += 1;
                } else {
                  numberToTimesBought[betNumber] = [];
                  numberToTimesBought[betNumber][0] = 1;
                  numberToTimesBought[betNumber][0] = 1;
                  if (loteryaId == currentLoteryaId) {
                    numberToTimesBought[betNumber][1] = 5;
                  } else {
                    numberToTimesBought[betNumber][1] = await loterya.isNumberAwarded(betNumber, loteryaId);;
                  }
                }
              }
            }
          }
          console.log(numberToTimesBought);

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
      console.log(dateToNumbers);
      setLoteryaIdToNumbers(Object.entries(dateToNumbers));
      setIsLoading(false);

    } catch (error) {
      console.log(error);
      window.alert("There was an error getting your previous numbers");
    }
  }

  const getMyDate = (date) => {
    date = new Date(date + 604818920);
    var day = date.getDay();
    var diff = date.getDate() - day + (day == 0 ? -6 : 1);
    var myDate = new Date(date.setDate(diff));
    return (myDate.getDate() +
      "/" + (myDate.getMonth() + 1).toString().padStart(2, "0") +
      "/" + myDate.getFullYear())
  };

  const setNumberHtml = (numbers) => {
    var resHtlm = [];
    console.log(numbers);
    Object.entries(numbers).forEach(([number, info]) => {
      if (info[0] == "Exclusive") {
        resHtlm.push(
          <p key={number}>{number} ({info[0]} 👑) - <strong>{getPrize(info[1])}</strong></p>
        );
      } else {
        resHtlm.push(
          <p key={number}>{number} (x{info[0]} times) - <strong>{getPrize(info[1])}</strong></p>
        );
      }

    });
    return resHtlm;
  }

  const getPrize = (numberPrize) => {
    switch (numberPrize) {
      case 1:
        return <span>🥇 <em>First Prize</em></span>;
      case 2:
        return <span>🥈 <em>Second Prize</em></span>;
      case 3:
        return <span>🥉 <em>Third Prize</em></span>;
      case 4:
        return <span><em>Fourth Prize</em></span>;
      case 5:
        return <span><em>Not yet awarded</em></span>;
      default:
        return <span><em>No Prize</em></span>;
    } 
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
        Here you can see your 10 previous drawings.
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
                    Drawing of {item[0]}
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