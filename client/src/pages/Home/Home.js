import React, {  useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import styles from "./Home.module.css";
import OrderYuqorilashi from "../../assets/icons/OrderYuqorilashi";
import Customers from "../../assets/icons/Customers";
import OrderIcon from "../../assets/icons/OrderIcon";
import Dollar from "../../assets/icons/Dollar";
import Photobox from "../../assets/icons/iconcasino.png";
import http from "../../utils/axios-instance";
import { toast } from "react-toastify";
import BarChart from "../../components/Chart/BarChart"
import ReChart from "../../components/Chart/ReChart";
function Home() {
  const [value,setValue]= useState()
  const [regions,setRegions] = useState()
  const [month,setMonth] = useState()
  const getStatistics = async () => {
    try {
      const res = await http({
        url: `/orders/statistics`,
      });
      setValue(res.data.data);
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };
  const getChartStatistics = async () => {
    try {
      const res = await http({
        url: `/orders/statisticcount`,
      });
      console.log(res);
      setRegions(res.data.regions);
      setMonth(res.data.months);
    } catch (error) {
      console.log(error);
      toast.error(error?.response.data.message);
    }
  };
  useEffect(() => {
    getChartStatistics()
    getStatistics();
  },[])

  return (
    <Layout pageName={"Bosh Sahifa"}>
      <div className={styles.statistics}>
        <div className={styles.containerFlex}>
          <div className={styles.container}>
            <div className={styles.svg} id="1">
              <img width="64" height="64" src={Photobox} alt="boxicon" />
            </div>
            <div className={styles.text}>
              <p>Barcha Buyurtmalar</p>
              <h2>{value?.allOrders || 0} ta</h2>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.svg}>
              <Customers />
            </div>
            <div className={styles.text}>
              <p>Firmalar</p>
              <h2>{value?.allStores || 0} ta</h2>
            </div>
           
          </div>
           <div className={styles.container}>
              <div className={styles.svg}>
                <OrderYuqorilashi />
              </div>
              <div className={styles.text}>
                <p>Sotilganlar</p>
                <h2>{value?.soldOrders || 0} ta</h2>
              </div>
            </div>
          <div className={styles.container}>
            <div className={styles.svg} id="1">
              <OrderIcon />
            </div>
            <div className={styles.text}>
              <p>Qaytarilgan Buyurtmalar</p>
              <h2>{value?.rejectedOrders || 0} ta</h2>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.svg}>
              <Dollar />
            </div>
            <div className={styles.text}>
              <p>Foyda</p>
              <h2>
                { value?.incomeSum?.toLocaleString("Ru-Ru")|| 0}
                sum
              </h2>
            </div>
          </div>
        </div>
      </div>

     {regions&&<ReChart data={regions}/>}
     {month&&<ReChart data={month}/>}
    </Layout>
  );
}

export default Home;
