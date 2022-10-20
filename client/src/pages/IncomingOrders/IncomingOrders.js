import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";

function IncomingOrders() {
  const [orders, setOrders] = useState(null);
  const [regions, setRegions] = useState(null);
  const [districts, setDistricts] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getOrdersByPackageId();
    getRegions();
    getDistricts();
  }, []);
  const getOrdersByPackageId = async () => {
    try {
      const res = await http({
        url: `/packages/${id}/orders`,
      });
      console.log(res.data.data);
      setOrders(res.data.data.ordersbyPackage);
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
        return extractById(order.regionId, regions);
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
        <button
        disabled={order.orderStatus==="NEW"?false:true}
          style={{ padding: "5px", margin: "2px", fontSize: "20px" }}
          onClick={()=>changeOrderStatus(order.id,"ACCEPTED")}
        >
          <>ACCEPTED</> 
        </button>
        <button
        disabled={order.orderStatus==="NEW"?false:true}

          style={{ padding: "5px", margin: "2px", fontSize: "20px" }}
          onClick={()=>changeOrderStatus(order.id,"NOT_EXIST")}
        >
         <>NOT EXIST</> 
        </button>
              </div>
    );}}

  ];
  return (
    <div>
      {orders?.length > 0 ? (
        <BasicTable columns={ordersCols} data={orders} />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </div>
  );
}

export default IncomingOrders;
