import React from 'react'
import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import styles from '../../../styles/LastRaffles.module.css'
import Placeholder from 'react-bootstrap/Placeholder';
import { loteryaContract, web3Provider } from "../utils/interact";

export default function LastRaffles() {

  const [raffles, setRaffles] = useState([]);
  const [showTable, setShowTable] = useState();
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getDataFromEvent = async (loterya, _loteryaId) => {
    try {
      var raffleData = {};
      let options = {
        filter: {
          loteryaId: _loteryaId.toString()
        },
        fromBlock: 31236089,
        toBlock: 'latest'
      };
      const event = await loterya.getPastEvents('RequestFulfilled', options);
      const web3 = web3Provider();

      const txHash = event[0].transactionHash;
      const blockNumber = (await web3.eth.getTransaction(txHash)).blockNumber;
      const timestampEvent = (await web3.eth.getBlock(blockNumber)).timestamp;     

      raffleData.operationTimestamp = timestampEvent * 1000;
      raffleData.number = event[0].returnValues.winnerNumber;
      raffleData.reward = (Number(event[0].returnValues.reward) / 1e8).toFixed(4);
      return raffleData;

    } catch (error) {
      console.log(error);
      window.alert("There was an error fetching data from event");
    }
  }

  const getRaffles = async () => {
    try {

      setIsLoading(true);

      const loterya = await loteryaContract();
      const currentLoteryaId = Number(await loterya.methods.loteryaId().call());
      var loteryaId = 0;
      if (currentLoteryaId > 10) {
        loteryaId = currentLoteryaId - 10;
      }

      const rafflesArray = [];
      for (loteryaId; loteryaId < currentLoteryaId; loteryaId++) {
        rafflesArray.push(await getDataFromEvent(loterya, loteryaId));
      }
      setRaffles(rafflesArray.reverse());
      setIsLoading(false);

    } catch (error) {
      console.log(error);
      window.alert("There was an error getting raffles");
    }
  }

  const copyHash = async (textToCopy) => {
    await navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  }

  const getMyDate = (date) => {
    var myDate = new Date(parseInt(date));
    return myDate.getDate() +
      "/" + (myDate.getMonth() + 1) +
      "/" + myDate.getFullYear()
  };

  const getNumberFormat = (number) => {
    var str = number.toString();
    return str.substring(0, str.length - 1) + " - " + str.substring(str.length - 1)
  }

  const getLoadingTable = () => {
    const tableHtml = [];
    for (var i = 0; i < 10; i++) {
      tableHtml.push(
        <tr key={i}>
          <Placeholder as="td" animation="glow">
            <Placeholder className="w-75" />
          </Placeholder>
          <Placeholder as="td" animation="glow">
            <Placeholder className="w-75" />
          </Placeholder>
          <Placeholder as="td" animation="glow">
            <Placeholder className="w-75" />
          </Placeholder>
        </tr>
      )
    }
    return tableHtml;
  }

  useEffect(() => {

    async function setListener() {
      const loterya = await loteryaContract();
      loterya.events.RequestFulfilled({}, async (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Update table");
          await getRaffles();
        }
      });
    }
    setListener();

    async function setRafflesTable() {
      await getRaffles();
    }
    setRafflesTable();
  }, []);


  return (
    <div className={styles.last_raffles}>
      <p className={styles.last_winners_table_title}>Last Drawings</p>
      <Table className={styles.last_winners_table} responsive striped bordered hover>
        <thead className={styles.table_header}>
          <tr>
            <th>Date</th>
            <th>Number</th>
            <th>Reward (USD)</th>
            {/* <th>Tx Hash</th> */}
          </tr>
        </thead>
        <tbody>
          {
            isLoading
              ? getLoadingTable()
              : raffles.map((item, index) => (
                <tr key={index}>
                  <td className={styles.last_raffles_table_numbers}>{getMyDate(item.operationTimestamp)}</td>
                  <td className={styles.last_raffles_table_numbers}>{item.number}</td>
                  <td className={styles.last_raffles_table_numbers}>{item.reward}</td>
                  {/* <td>
                  <a className='m-2' onClick={() => {copyHash(item.txHash)}}>
                    {isCopied ? <p>Copied!</p> : <p>Copy</p>}
                  </a>
                </td> */}
                </tr>
              ))
          }
        </tbody>
      </Table>
    </div >
  )
}