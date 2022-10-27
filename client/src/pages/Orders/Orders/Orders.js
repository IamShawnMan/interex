import { useContext, useEffect } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import http from "../../../utils/axios-instance";
import { useState } from "react";
import { BasicTable } from "../../../components/Table/BasicTable";
import Layout from "../../../components/Layout/Layout";
import AppContext from "../../../context/AppContext";
import { toast } from "react-toastify";
import Button from "../../../components/Form/FormComponents/Button/Button";
import { formatDate } from "../../../utils/dateFormatter";
import Filter from "../../../components/Filter/Filter";
function Orders() {
  const { user } = useContext(AppContext);
  const isAdmin = user.userRole === "ADMIN";
  const isSuperAdmin = user.userRole === "SUPER_ADMIN";
  const isStoreOwner = user.userRole === "STORE_OWNER";
  const [pagination, setPagination] = useState(null);
  const [value, setValue] = useState(null);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 2;
  const [allQueries, setQueries] = useState(null);
  const { id } = useParams();
  const  url=
    ((isAdmin || isSuperAdmin) &&id&& `packages/${id}/orders`) ||((isAdmin || isSuperAdmin) && `orders`)||
    (isStoreOwner && `orders/myorders`)
  


  const getAllMyOrders = async (data) => {
    setValue(data?.myOrders?.content);
    setPagination(data?.myOrders?.pagination);
  };

  const getAllOrders = async (data) => {
    setValue(data?.allOrders?.content);
    setPagination(data?.allOrders?.pagination);
  };

  const getOrdersByPackageId = async (data) => {
      setValue(data?.ordersbyPackage?.content);
      setPagination(data?.ordersbyPackage?.pagination);
  };
  const changeOrderStatus = async (id,status) => {
    try {
      const res = await http({
        url: `/orders/${id}`,
        method: "PATCH",
        data: {
          orderStatus: status
        },
      });
      getOrdersByPackageId(allQueries)
    } catch (error) {
      console.log(error);
    }
  };
  const cols = [
    { Header: "id", accessor: "id" },
    { Header: "Haridor", accessor: "recipient" },
    { Header: "Holati", accessor: "orderStatus" },
    { Header: "Telefon", accessor: "recipientPhoneNumber" },
    { Header: "Eslatma", accessor: "note" },
    { Header: "Viloyat", accessor: "region.name" },
    { Header: "Tuman", accessor: "district.name" },
    {
      id: "deliveryPrice",
      Header: "Yetkazish narxi",
      accessor: "deliveryPrice",
    },
    { id: "totalPrice", Header: "Malhsulotning narxi", accessor: "totalPrice" },
    {
      Header: "Sanasi",
      accessor: (order) => {
        return formatDate(order.createdAt);
      },
    },
    {
      Header: "Action",
      accessor: (order) => {
        return (
          <div>
            {user.userRole === "STORE_OWNER" && (
             <>
                <Link style={{textDecoration: "none",color: "white",marginBottom: ".5rem",display: "inline-block",pointerEvents:order.orderStatus!=="NEW"&& "none"}} to={`/orders/${order.id}`}> <Button size="small" disabled={order.orderStatus!=="NEW"?true:false} name="btn">Update</Button></Link>
              </>
            )}
            {user.userRole === "ADMIN" && (
             <div>
           
           

             <span style={{ width: "12rem",paddingBottom:"5px", display:"block"}}  onClick={()=>changeOrderStatus(order.id,"ACCEPTED")}>
               <Button
             name="btn"
             disabled={order.orderStatus==="NEW"?false:true}
              
             >
               <>ACCEPTED</> 
             </Button>
             </span>
             <span style={{ width: "12rem", display:"block" }}  onClick={()=>changeOrderStatus(order.id,"NOT_EXIST")}>
             
             <Button
             disabled={order.orderStatus==="NEW"?false:true}
             size="small"
             name="btn"
              
             >
              <>NOT EXIST</> 
             </Button>
             </span>
             
                   </div>
            )} 
                <Link style={{textDecoration: "none",color: "white",display: "block",marginTop: ".5rem"}} to={`/orders/info/${order.id}`}><Button size="small" name="btn">Info</Button></Link>
          </div>
        );
      },
    }
  ];

  

const filterFn=async(data)=>{
 setQueries(data)
  const dateCreatedAt = new Date(data?.createdAt);

  try {
    if (isAdmin || isSuperAdmin) {
      const res = await http({
        url: `/${url}?page=${page}&size=${size}${
          data?.status ? `&orderStatus=${data.status}` : ""
        }${data?.regionId ? `&regionId=${data.regionId}` : ""}${
          data?.districtId ? `&districtId=${data.districtId}` : ""
        }${data?.storeOwnerId ? `&storeOwnerId=${data.storeOwnerId}` : ""}${
          data?.createdAt
            ? `&createdAt[gte]=${dateCreatedAt.toISOString()}`
            : ""
        }`,
      });
      id&&getOrdersByPackageId(res.data.data)
      !id&&getAllOrders(res.data.data);
    } else if (isStoreOwner) {
      const res = await http(
        `/${url}?page=${page}&size=${size}${
          data?.status ? `&orderStatus=${data.status}` : ""
        }${data?.regionId ? `&regionId=${data.regionId}` : ""}${
          data?.districtId ? `&districtId=${data.districtId}` : ""
        }${data?.createdAt ? `&createdAt[gte]=${data.createdAt}` : ""}`
      );
      getAllMyOrders(res.data.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }

}

  


  return (
    <Layout pageName="Jo'natmalar Ro'yxati">
      {isStoreOwner && (
        <Link style={{ display: "block", width: "12rem" }} to="/orders/new">
          <Button size="small" name="btn">
            Add Order
          </Button>
        </Link>
      )}
      <Filter
       
        filterFn={filterFn}
      />
      {value?.length > 0 ? (
        <BasicTable
          columns={cols}
          data={value}
          pagination={pagination}
          url="orders"
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}

export default Orders;
