import React, { useEffect, useMemo, useState } from "react";
import http from "../../../utils/axios-instance";
import { BasicTable } from "../../../components/Table/BasicTable";
import Modal from "../../../components/Modal/Modal";
import styles from "../Orders/Orders.module.css";
import { phoneNumberFormat } from "../../../utils/phoneNumberFormatter";

const OrderInfo = ({ id, onClose }) => {
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(null);
  useEffect(() => {
    getById();
  }, []);
  const getById = async () => {
    const res = await http({
      url: `/orders/${id}`,
    });
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
    { id: "productName", Header: "Mahsulot omi", accessor: "productName" },
    { id: "quantity", Header: "Soni", accessor: "quantity" },
    {
      id: "price",
      Header: "Narxi",
      accessor: "price",
    },
    {
      id: "Total Price",
      Header: "Umumiy narxi",
      accessor: "orderItemTotalPrice",
    },
  ];

  return (
    <Modal onClose={onClose}>
      <div className={styles.orderInfo}>
        <ul style={{ listStyle: "none" }}>
          <li className="h6">
            <p className="bold inline-block">Xaridor Ismi:</p>{" "}
            <span>{value?.recipient}</span>
          </li>
          <li className="h6">
            <p className="bold inline-block"> Xaridor telefon raqami:</p>
            <span>{phoneNumberFormat(value?.recipientPhoneNumber)}</span>
          </li>

          <li className="h6">
            <p className="bold inline-block">Mahsulot narxi:</p>{" "}
            <span>{value?.totalPrice}</span>
          </li>
          <li className="h6">
            <p className="bold inline-block">Mahsulot holati:</p>{" "}
            {value?.orderStatus}
          </li>
          <li className="h6">
            <p className="bold inline-block"> Viloyat:</p>
            <span>{value?.region?.name}</span>
          </li>
          <li className="h6">
            <p className="bold inline-block"> Tuman:</p>
            <span>{value?.district?.name}</span>
          </li>
        </ul>
        {items?.length > 0 ? (
          <BasicTable columns={itemsCols} data={items} />
        ) : (
          <p>Malumotlar yoq</p>
        )}
      </div>
    </Modal>
  );
};

export default OrderInfo;
