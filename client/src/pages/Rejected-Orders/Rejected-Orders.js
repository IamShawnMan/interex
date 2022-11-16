import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/Form/FormComponents/Button/Button";
import Input from "../../components/Form/FormComponents/Input/Input";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";
import { formatDate } from "../../utils/dateFormatter";
import styles from "./Rejected-Orders.module.css";

function RejectedOrders() {
  const { id } = useParams();
  const [info, setInfo] = useState(false);
  const [postStatus, setPostStatus] = useState(null);
  const [ordersIdArr, setOrdersIdArr] = useState(null);
  const [value, setValue] = useState([]);

  useEffect(() => {
    getByIdPostOrders();
  }, []);
  const cols = [
    {
      id: "id",
      Header: "ID",
      accessor: "id",
    },
    {
      id: "recipient",
      Header: "Xaridor",
      accessor: "recipient",
    },
    {
      id: "region",
      Header: "Manzil",
      accessor: (order) => {
        return <>{order.district.name}</>;
      },
    },
    {
      id: "deliveryPrice",
      Header: "Yetkazish narxi",
      accessor: (order) => {
        return <>{`${order.deliveryPrice.toLocaleString("Ru-Ru")} so'm`}</>;
      },
    },
    {
      id: "totalPrice",
      Header: "Mahsulotning narxi",
      accessor: (order) => {
        return <>{`${order.totalPrice.toLocaleString("Ru-Ru")} so'm`}</>;
      },
    },

    { id: "status", Header: "Holati", accessor: "orderStatus" },
    {
      id: "updatedAt",
      Header: "Oxirgi o'zgarish",
      accessor: (order) => {
        return formatDate(order.updatedAt);
      },
    },
    {
      id: "action",
      Header: "Tugma",
      accessor: (order) => {
        return (
          <div className={styles.actionContainer}>
            <Button
              size="small"
              name="btn"
              onClick={() => {
                setInfo(order.id);
              }}
            >
              Ma'lumot
            </Button>
            {ordersIdArr && (
              <Input
                disabled={postStatus && postStatus !== "NEW"}
                type="checkbox"
                checked={ordersIdArr.includes(order.id)}
                onClick={() => {
                  const index = ordersIdArr.includes(order.id);
                  if (index) {
                    let orderIsArr = ordersIdArr.filter((i) => i !== order.id);
                    setOrdersIdArr(orderIsArr);
                  } else {
                    setOrdersIdArr((prev) => [...prev, order.id]);
                  }
                }}
              ></Input>
            )}
          </div>
        );
      },
    },
  ];

  const getByIdPostOrders = async () => {
    try {
      const res = await http(`/postback/rejectedposts/${id}`);
      setValue(res?.data?.data?.rejectedOrdersInPost?.rows);
      setOrdersIdArr(res?.data?.data?.rejectedOrdersInPost?.rows);
    } catch (error) {}
  };
  const updatePostAndOrdersStatusHandler = async () => {
    console.log(ordersIdArr);
  };
  const closeHandler = () => {
    setInfo(false);
  };
  return (
    <Layout>
      {value.length > 0 ? (
        <>
          <BasicTable columns={cols} data={value} />
          <Button
            btnStyle={{ width: "13rem" }}
            name="btn"
            type="button"
            onClick={updatePostAndOrdersStatusHandler}
          >
            Qabul qildim
          </Button>
        </>
      ) : (
        <p>Ma'lumotlar yo'q</p>
      )}
    </Layout>
  );
}

export default RejectedOrders;