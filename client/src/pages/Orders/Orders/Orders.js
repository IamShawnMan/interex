import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import http from "../../../utils/axios-instance";
import { useState } from "react";
import { BasicTable } from "../../../components/Table/BasicTable";
import Layout from "../../../components/Layout/Layout";
import AppContext from "../../../context/AppContext";
import { toast } from "react-toastify";
function Orders() {
  const { user } = useContext(AppContext);

  const [value, setValue] = useState(null);
  const getAllUser = async () => {
    const res = await http({
      url: "/packages/myorders",
    }); console.log(res);
    setValue(res.data[0].orders);
   
  };
  useEffect(() => {
    getAllUser();
  }, []);
 const changeOrderStatus=async(id,status)=>{
  const res = await http({
    url: `/orders/${id}`,
    method: "PATCH",
    data: {orderStatus:status}
  });
 toast.success("Order Status Updated")
  getAllUser()
 }
  const ordersCols = [
    { Header: "id", accessor: "id" },
    { Header: "DeliveryPrice", accessor: "deliveryPrice" },
    { Header: "OrderStatus", accessor: "orderStatus" },
    { Header: "Recipient", accessor: "recipient" },
    { Header: "TotalPrice", accessor: "totalPrice" },
    { Header: "packageId", accessor: "packageId" },
    { Header: "Note", accessor: "note" },
    { Header: "recipientPhoneNumber", accessor: "recipientPhoneNumber" },
    { Header: "RegionID", accessor: "regionId" },
    { Header: "DistrictId", accessor: "districtId" },
    { Header:"Action", accessor: (order)=>{ return (
      <div>
       { user.userRole==="STORE_OWNER"&& <Link to={`/orders/${order.id}`}>Update</Link>}
   { user.userRole==="ADMIN"&&  <>
        <button
          style={{ padding: "5px", margin: "2px", fontSize: "20px" }}
          onClick={()=>changeOrderStatus(order.id,"ACCEPTED")}
        >
          <>ACCEPTED</> 
        </button><button
          style={{ padding: "5px", margin: "2px", fontSize: "20px" }}
          onClick={()=>changeOrderStatus(order.id,"NOT_EXIST")}
        >
         <>NOT EXIST</> 
        </button></>}
              </div>
    );}}
  ];

  return (
    <Layout>
        {user.userRole === "STORE_OWNER" &&  <Link to="/orders/new">Add Order</Link>}
      {value?.length > 0 ? (
        <BasicTable columns={ordersCols} data={value} />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}

export default Orders;
