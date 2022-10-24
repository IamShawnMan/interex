import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Button from "../../components/Form/FormComponents/Button/Button";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";

function IncomingOrders() {
  const [orders, setOrders] = useState(null);
  const [regions, setRegions] = useState(null);
  const [districts, setDistricts] = useState(null);
  const [pagination, setPagination] = useState({});
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 2;
  const { id } = useParams();

  useEffect(() => {
    getOrdersByPackageId();
    getRegions();
    getDistricts();
  }, [page]);
  const getOrdersByPackageId = async () => {
    try {
      const res = await http({
        url: `/packages/${id}/orders?page=${page}&size=${size}`,
      });
      setOrders(res.data.data.ordersbyPackage.content);
      setPagination(res.data.data.ordersbyPackage.pagination);

    } catch (error) {
      console.log(error);
    }
  };
  const getDistricts = async () => {
    try {
      const res = await http({
        url: "/districts",
      });

      setDistricts(res.data.data.allDistricts);
    } catch (error) {}
  };

  const getRegions = async () => {
    try {
      const res = await http({
        url: "/regions",
      });

      setRegions(res.data.data.allRegions);
    } catch (error) {}
  };
  const extractById = (mainValue, returnArray) => {
    console.log(mainValue,returnArray);
    let returnValue;
    if (returnArray) {
      returnArray.filter((e) => {
        if (mainValue === e.id) returnValue = e.name;
      });
    }
    return returnValue;
  };

  const changeOrderStatus = async (id,status) => {
    console.log(status);
    try {
      const res = await http({
        url: `/orders/${id}`,
        method: "PATCH",
        data: {
          orderStatus: status
        },
      });
      getOrdersByPackageId()
    } catch (error) {
      console.log(error);
    }
  };

  const ordersCols = [
    {
      id: "No",
      Header: "No",
      accessor: (_, i) => {
        return `${i + 1}`;
      },
    },
    {
      id: "region",
      Header: "Viloyat",
      accessor: (order) => {
        console.log(order);
        return extractById(order.regionId, regions?.content);
      },
    },
    {
      id: "district",
      Header: "Tuman/Shahar",
      accessor: (order) => {
        return extractById(order.districtId, districts);
      },
    },
    {
      id: "resivier",
      Header: "Oluvchining telefon raqami",
      accessor: "recipientPhoneNumber",
    },
    {
      id: "orderPrice",
      Header: "Jo'natmaning narxi",
      accessor: "totalPrice",
    },
    {
      id: "orderStatus",
      Header: "Jo'natmaning holati",
      accessor: "orderStatus",
    },
    { Header:"Action", accessor: (order)=>{ return (
      <div>
        <span style={{ width: "12rem",paddingBottom:"5px", display:"block"}}  onClick={()=>changeOrderStatus(order.id,"ACCEPTED")}>
          <Button
        // size="medium"
        name="btn"
        disabled={order.orderStatus==="NEW"?false:true}
          // btnStyle={{width: "40%" }}
         
        >
          <>ACCEPTED</> 
        </Button>
        </span>
        <span style={{ width: "12rem", display:"block" }}  onClick={()=>changeOrderStatus(order.id,"NOT_EXIST")}>
        
        <Button
        disabled={order.orderStatus==="NEW"?false:true}
        size="small"
        name="btn"
          // btnStyle={{width: "40%" }}
         
        >
         <>NOT EXIST</> 
        </Button>
        </span>
              </div>
    );}}

  ];
  return (
    <Layout pageName="Jo'natmalar Ro'yxati">
    <div>
      {orders?.length > 0 ? (
        <BasicTable columns={ordersCols} data={orders}
        url={`packages/${id}/orders`}
        pagination={pagination} />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </div>
    </Layout>
  );
}

export default IncomingOrders;
