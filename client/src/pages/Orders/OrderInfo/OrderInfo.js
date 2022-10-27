import React, { useEffect, useState } from "react";
import http from "../../../utils/axios-instance";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import Button from "../../../components/Form/FormComponents/Button/Button"
import { BasicTable } from "../../../components/Table/BasicTable";
const OrderInfo = () => {
  const { id } = useParams();
  const [value,setValue]= useState(null)
  const [items,setItems]= useState(null)
  useEffect(() => {
  getById();
  },[])
  const getById = async () => {
    const res = await http({
      url: `/orders/${id}`,
    });
    setValue(res.data.data.orderById)
    setItems(res.data.data.orderById.items)
};
const itemsCols = [
    {
      id: "price",
      Header: "price",
      accessor:"price"
    },
    { id: "productName", Header: "productName", accessor: "productName" },
    { id: "quantity", Header: "quantity", accessor: "quantity" },
    { id: "Total Price", Header: "Total Price", accessor: "orderItemTotalPrice" },
  ];

    return (   
    
    <Layout  pageName="Jo'natmalar Malumoti">    {console.log(items)}
    <li>Recipient {value?.recipient}</li>
    <li>Price {value?.totalPrice}</li>
    <li>Region Name {value?.region?.name}</li>
    <li>District Name {value?.district?.name}</li>
    <li>Status {value?.orderStatus}</li>
     {items?.length > 0 ? (
        <BasicTable
          columns={itemsCols}
          data={items}
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
     );
}
 
export default OrderInfo;