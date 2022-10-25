import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout/Layout";
import { BasicTable } from "../../../components/Table/BasicTable";
import http from "../../../utils/axios-instance";

function PostInnerOrders() {
  const [orders, setOrders] = useState(null);
  const [regions, setRegions] = useState(null);
  const [districts, setDistricts] = useState(null);
  const { id } = useParams();
  const navigate=useNavigate();
  console.log(id,"PostInnerOrders");
  useEffect(() => {
    getOrdersByPackageId();
    getRegions();
    getDistricts();
  }, []);
  const getOrdersByPackageId = async () => {
    try {
      const res = await http({
        url: `/posts/new`,
        method: "POST",
        data:{regionId:id}
      });
      // console.log(res);
        toast.success(res.data.message);
        navigate("/posts")
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
            </div>
    );}}

  ];
  return (
    <Layout pageName="Postlar">
    <div>
      {/* {orders?.length > 0 ? (
        <BasicTable columns={ordersCols} data={orders} />
      ) : (
        <p>Malumotlar yoq</p>
      )} */}
    </div> </Layout>
  );
}

export default PostInnerOrders;
