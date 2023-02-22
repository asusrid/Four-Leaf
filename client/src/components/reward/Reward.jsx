import styles from '../../../styles/Reward.module.css'
import { useEffect, useState } from 'react'
import { loteryaContract } from "../utils/interact"
import { LOTERYA_CONTRACT_ADDRESS, ABI } from '../../../constants';

export default function BetNumber() {

  const [reward, setReward] = useState();
  const [currentLoteryaId, setCurrentLoteryaId] = useState(null);

  const getReward = async () => {
    try {
      const rewardUSD = await loteryaContract().methods.getRewardUSD().call() / 1e26;
      console.log(">>>>>>>> ",await loteryaContract().methods.getRewardUSD().call());
      setReward(rewardUSD.toFixed(2));
    } catch (error) {
      console.log(error);
      window.alert("There was an error with reward");
    }
  }

  useEffect(() => {

    getReward();

    async function initialValueLoteryaId() {
      const loterya = await loteryaContract();
      const _currentLoteryaId = Number(await loterya.methods.loteryaId().call());
      setCurrentLoteryaId(_currentLoteryaId);
    }
    initialValueLoteryaId();

    async function setListener() {
      const loterya = await loteryaContract();
      loterya.events.RequestFulfilled({}, (error, data) => {
        if (error) {
          console.log(error);
        } else {
          const newLoteryaId = Number(data.returnValues.loteryaId) + 1;
          const newReward = (data.returnValues.reward / 1e8).toFixed(2);
          setCurrentLoteryaId(newLoteryaId);
          setReward(newReward);
          console.log("New draw, update ID", newLoteryaId);
        }
      });
    }
    setListener();

  }, []);

  useEffect(() => {

    async function setListener() {
      
      const loterya = await loteryaContract();
      let options = {
        filters: {
          loteryaId: currentLoteryaId
        },
        fromBlock: 31236089
      };
      // ---------- CHECK THIS EVENT DOESNT TRIGGER MORE THAN ONCE ------------
      loterya.events.NumberPurchased({}, (error, data) => {
        if (error) {
          console.log(error);
        } else {
          // console.log("🎉 Your number has been purchased successfully!");
          setReward((data.returnValues.reward / 1e8).toFixed(2));
        }
      });
    }
    if (currentLoteryaId != null) {
      setListener();
    }

    // return () => {
    //   contract.removeAllListeners();
    // };
  }, [currentLoteryaId])


  return (
    <div id='home' className={styles.reward}>
      <p className={styles.reward_title}>Why not winning today?</p>
      <p className={styles.reward_money}>{reward} USD</p>
      <p className={styles.reward_dates}>Drawings all Mondays</p>
    </div>
  )
}
