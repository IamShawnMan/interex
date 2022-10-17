import { useEffect } from "react";
import { Link } from "react-router-dom";
import http from "../../../utils/axios-instance";
import { useState } from "react";
import { BasicTable } from "../../../components/Table/BasicTable";
import Layout from "../../../components/Layout/Layout";
function Orders() {
  const [value, setValue] = useState(null);
  const getAllUser = async () => {
    const res = await http( {
      url: "/orders",
    });
    setValue(res.data.data.allOrders.content);
    console.log(res);
  };
  useEffect(() => {
    getAllUser();
  }, []);

  const ordersCols = [
    { Header: "id", accessor: "id" },
    { Header: "DeliveryPrice", accessor: "deliveryPrice" },
    { Header: "OrderStatus", accessor: "orderStatus" },
    { Header: "Recipient", accessor: "recipient" },
    { Header: "TotalPrice", accessor: "totalPrice" },
  ];

  return (
    <Layout>
      <Link to="/orders/new">Add Order</Link>
      {value?.length > 0 ? (
        <BasicTable columns={ordersCols} data={value} />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}

export default Orders;
