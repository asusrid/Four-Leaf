import React from 'react'
import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import styles from '../../../styles/LastRaffles.module.css'
import Placeholder from 'react-bootstrap/Placeholder';
import { loteryaContract, web3Provider } from "../utils/interact";

export default function LastRaffles() {

  const [raffles, setRaffles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getDataFromEvent = async (loterya, _loteryaId) => {
    try {
      var raffleData = {};
      let options = {
        filter: {
          loteryaId: _loteryaId.toString()
        },
        // fromBlock: 39592097,
        fromBlock:32496029,
        toBlock: 'latest'
      };
      const event = await loterya.getPastEvents('RequestFulfilled', options);
      const web3 = web3Provider();

      const txHash = event[0].transactionHash;
      const blockNumber = (await web3.eth.getTransaction(txHash)).blockNumber;
      const timestampEvent = (await web3.eth.getBlock(blockNumber)).timestamp;     

      raffleData.operationTimestamp = timestampEvent * 1000;
      raffleData.number = event[0].returnValues.winnerNumber;
      raffleData.reward = (Number(event[0].returnValues.reward) / 1e26).toFixed(4);
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
      console.log("------->>>>", rafflesArray);
      setRaffles(rafflesArray.reverse());
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
            <th className={styles.last_raffles_table_numbers}>Date</th>
            <th className={styles.last_raffles_table_numbers}>Number</th>
            <th className={styles.last_raffles_table_numbers}>Prize (USD)</th>
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
                </tr>
              ))
          }
        </tbody>
      </Table>
    </div >
  )
}