import React, { useEffect, useMemo, useState } from "react";
import http from "../../../utils/axios-instance";
import { BasicTable } from "../../../components/Table/BasicTable";
import Modal from "../../../components/Modal/Modal";
import styles from "../Orders/Orders.module.css";
import stylesInfo from "./OrderInfo.module.css";
import { phoneNumberFormat } from "../../../utils/phoneNumberFormatter";
import Admin from "./Admin.png";
import AdminGreen from "./AdminGreen.png";
import Car from "./Car.png";
import CarYellow from "./CarYellow.png";
import Clock from "./Clock.png";
import ClockYellow from "./ClockYellow.png";
import Pochta from "./Pochta.png";
import PochtaQizil from "./PochtaQizil.png";
const OrderInfo = ({ id, onClose }) => {
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(null);
  const [tracking, setTracking] = useState(null);
  useEffect(() => {
    getById();
  }, []); 
  const getById = async () => {
    const res = await http({
      url: `/orders/${id}`,
    });
    setTracking(res.data.data.trackingByOrderId)
    setValue(res.data.data.orderById);
    setItems(res.data.data.orderById.items);
  };

  const itemsCols = [
    {
      id: "id",
      Header: "No",
      accessor: (e, i) => {
        return `${i + 1}`;
      },
    },
    {
      id: "productName",
      Header: "Maxsulot nomi",
      accessor: "productName",
    },
    {
      id: "quantity",
      Header: "Soni",
      accessor: "quantity",
    },
    {
      id: "Total Price",
      Header: "Umumiy narxi",
      accessor: (order) => {
        return (
          <>{`${order.orderItemTotalPrice.toLocaleString("Ru-Ru")} so'm`}</>
        );
      },
    },
  ];

  return (
    <div className="div">
      <div className={styles.orderInfo}>
        <ul
          style={{
            listStyle: "none",
            textAlign: "center",
          }}
        >  <li className="h3">
            {/* <p className="bold inline-block"> Firma nomi:</p> */}
            <span>
              <b> {value?.storeOwner?.storeName}</b>
            </span>
          </li>
         
          <li className="h6">
            <p className="bold inline-block"> Xaridor telefon raqami:</p>
            <span>
              <a href={`tel:${value?.recipientPhoneNumber}`}>
                {phoneNumberFormat(value?.recipientPhoneNumber)}
              </a>
            </span>
          </li>

          <li className="h6">
            <p className="bold inline-block">Mahsulot holati:</p>{" "}
            {value?.orderStatusUz}
          </li>
          <li className="h6">
            <p className="bold inline-block"> Viloyat:</p>
            <span>{value?.region?.name}</span>
          </li>
          <li className="h6">
            <p className="bold inline-block"> Tuman:</p>
            <span>{value?.district?.name}</span>
          </li>
          <li className="h6">
            <p className="bold inline-block"> Ortiqcha harajat: </p>
            <span> {value?.expense.toLocaleString("Ru-Ru")} so'm</span>
          </li>
        
          <li className="h6">
            <p className="bold inline-block"> Eslatma:</p>
            <span>{value?.note.split(" ").splice(1).join(" ")}</span>
          </li>
        </ul>
        {items?.length > 0 ? (
          <BasicTable
            columns={itemsCols}
            style={{ overflowY: "scroll" }}
            data={items}
          />
        ) : (
          <p>Malumotlar yoq</p>
        )}
{console.log(tracking)}
        <div className={stylesInfo.container}>
          <div className={`${stylesInfo.ellipse} ${tracking?.length===0||tracking?.length>0 ?`${stylesInfo.ellipseColor}`:""}`}>
            <img
              width="40"
              src={ Car}
              alt=""
              className={stylesInfo.svg}
            />
          </div>
          <div className={`${stylesInfo.rectangle} ${tracking?.length===1||tracking?.length>1 ?`${stylesInfo.rectangleColor}`:""}`}></div>
          <div className={`${stylesInfo.ellipse} ${tracking?.length===1||tracking?.length>1 ?`${stylesInfo.ellipseColor}`:""}`}>
            <img
              width="40"
              src={Admin}
              alt=""
              className={stylesInfo.svg}
            />
          </div>
          <div className={`${stylesInfo.rectangle} ${tracking?.length===2||tracking?.length>2 ?`${stylesInfo.rectangleColor}`:""}`}></div>
         
          <div className={`${stylesInfo.ellipse} ${tracking?.length===2||tracking?.length>2 ?`${stylesInfo.ellipseColor}`:""}`}>
            <img
              width="40"
              src={Clock}
              alt=""
              className={stylesInfo.svg}
            />
          </div> 
          <div className={`${stylesInfo.rectangle} ${tracking?.length===3||tracking?.length>3 ?`${stylesInfo.rectangleColor}`:""}`}></div>
          {console.log(tracking?.slice(-1))}
          <div  className={`${stylesInfo.ellipse}`} style={{backgroundColor:(tracking?.slice(-1)[0]?.toStatus==="SOLD"&&"green")||
         ( tracking?.slice(-1)[0]?.toStatus==="REJECTED"&&"red")||(tracking?.slice(-1)[0]?.toStatus==="PENDING"&&"yellow")}}>
            <img
              width="40"
              src={Pochta}
              alt=""
              className={stylesInfo.svg}
            />
          </div>
        </div>

        <div className={stylesInfo.container}>
          <p className={stylesInfo.p}>Firmada</p>
          <p className={stylesInfo.p}>Pochtada</p>
          <p className={stylesInfo.p}>Viloyatda</p>
          <p className={stylesInfo.p}>{(tracking?.slice(-1)[0]?.toStatus==="SOLD"&&"Sotildi")||
         ( tracking?.slice(-1)[0]?.toStatus==="REJECTED"&&"Atkaz")||(tracking?.slice(-1)[0]?.toStatus==="PENDING"&&"Kutilmoqda")}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
