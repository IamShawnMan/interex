import { useContext, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import http from "../../../utils/axios-instance";
import { useState } from "react";
import { BasicTable } from "../../../components/Table/BasicTable";
import Layout from "../../../components/Layout/Layout";
import AppContext from "../../../context/AppContext";
import { toast } from "react-toastify";
import Button from "../../../components/Form/FormComponents/Button/Button";
import { formatDate } from "../../../utils/dateFormatter";
import Filter from "../../../components/Filter/Filter";
import styles from "./Orders.module.css";
import Input from "../../../components/Form/FormComponents/Input/Input";
import Select from "../../../components/Form/FormComponents/Select/Select";
function Orders() {
  const { user } = useContext(AppContext);
  const isAdmin = user.userRole === "ADMIN";
  const isSuperAdmin = user.userRole === "SUPER_ADMIN";
  const isStoreOwner = user.userRole === "STORE_OWNER";
  const [pagination, setPagination] = useState(null);
  const [value, setValue] = useState(null);
  const [ordersIdArr, setOrdersIdArr] = useState(null);
  const [price, setPrice] = useState(null);
  const [postStatus, setPostStatus] = useState(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const [allQueries, setQueries] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const url = location.pathname
  // console.log(url);
// console.log(ordersIdArr);
  useEffect(() => {
    filterFn(allQueries);
    getPrices()
  }, [page]);
  const getPrices = async () => {
    const res = await http({
      url: "/orders/devprice",
    });
    setPrice(res.data);
  };

  const getAllMyOrders = async (data) => {
    setValue(data?.data?.content);
    setPagination(data?.data?.pagination);
    setOrdersIdArr(data?.data?.ordersArrInPost)
    setPostStatus(data?.data?.currentPostStaus.postStatus)
  };
  const changeOrderStatus = async (id, status) => {
    try {
      const res = await http({
        url: `/orders/${id}`,
        method: "PATCH",
        data: {
          orderStatus: status,
        },
      });
      filterFn(allQueries);
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
      accessor: (order)=>{
      return <>
      {order.orderStatus==="NEW"&&id&&( <Select
              data={price?.map(e=>{return {id:e,name:e}})}
             onChange={async(e)=>{
              console.log(e.target.value);
              const res = await http({
                url: `orders/${order.id}/devprice`,
                method:"PATCH",
                data:{deliveryPrice:e.target.value}
              });
               console.log(res); }
          
            }
            >
              Prices
            </Select>)}
            {order.status!=="NEW"&&order.deliveryPrice}
            </>
      }
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
        <div className={styles.actionContainer}>
         
         {( (isAdmin&&url.split("/")[1]!=="posts")||isStoreOwner)&& <div className={styles.actionContainer}>
            {user.userRole === "STORE_OWNER" && (
              <Button
                size="small"
                disabled={order.orderStatus !== "NEW" ? true : false}
                name="btn"
                onClick={() => {
                  navigate(`/orders/${order.id}`);
                }}
              >
                Update
              </Button>
            )} 
          { isAdmin &&id&&<div>
                <Button
                  name="btn"
                  disabled={order.orderStatus === "NEW" ? false : true}
                  onClick={() => changeOrderStatus(order.id, "ACCEPTED")}
                >
                  <>ACCEPTED</>
                </Button>

                <Button
                  disabled={order.orderStatus === "NEW" ? false : true}
                  size="small"
                  name="btn"
                  onClick={() => changeOrderStatus(order.id, "NOT_EXIST")}
                >
                  <>NOT EXIST</>
                </Button>
               
              </div>}
           </div>}
            <Button
                  size="small"
                  name="btn"
                  onClick={() => {
                    navigate(`/orders/info/${order.id}`);
                  }}
                >
                  Info
                </Button>
               {ordersIdArr&& <Input disabled={postStatus!=="NEW"} type="checkbox" checked={ordersIdArr.includes(order.id)} onClick={() => {
                    const index = ordersIdArr.includes(order.id);
                   if(index){
                    let orderIsArr=ordersIdArr.filter(i =>i!==order.id)
                    setOrdersIdArr(orderIsArr)
                   } else{
                    setOrdersIdArr(prev => ([...prev, order.id]));
                   }
                  }}></Input>}
          </div>
        );
      },
    },
  ];

  const filterFn = async (data) => {
    setQueries(data);
    console.log(data);
    const dateCreatedAt = new Date(data?.createdAt)
    console.log(url);
    try {
      if (isAdmin || isSuperAdmin) {
        console.log(isAdmin,isSuperAdmin);
        const res = await http({
          url: `${url}?page=${page}&size=${size}${
            data?.status ? `&orderStatus=${data.status}` : ""
          }${data?.regionId ? `&regionId=${data.regionId}` : ""}${
            data?.districtId ? `&districtId=${data.districtId}` : ""
          }${data?.storeOwnerId ? `&storeOwnerId=${data.storeOwnerId}` : ""}${
            data?.createdAt
              ? `&createdAt[eq]=${data?.createdAt}`
              : ""
          }`,
        });
        getAllMyOrders(res.data);
      } else if (isStoreOwner) {
        const res = await http(
          `${url}/myorders?page=${page}&size=${size}${
            data?.status ? `&orderStatus=${data.status}` : ""
          }${data?.regionId ? `&regionId=${data.regionId}` : ""}${
            data?.districtId ? `&districtId=${data.districtId}` : ""
          }${data?.createdAt ? `&createdAt[eq]=${dateCreatedAt.toISOString()}` : ""}`
        );
        console.log(res);
        getAllMyOrders(res.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
console.log("render");
  return (
    <Layout pageName="Jo'natmalar Ro'yxati">
      {isStoreOwner && (
        <Button
          size="small"
          name="btn"
          onClick={() => {
            navigate("/orders/new");
          }}
          btnStyle={{ display: "inline-block", width: "12rem" }}
        >
          Add Order
        </Button>
      )}
      <Filter filterFn={filterFn} />
      {value?.length > 0 ? (
        <BasicTable
          columns={cols}
          data={value}
          pagination={pagination}
          url={url}
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
      <div style={{display:"flex",gap:1}}>
      {url.split("/")[1]==="posts"&&postStatus==="NEW"&&<Button type="submit" size="small" name="btn"onClick={async() =>{
        console.log(ordersIdArr);
         const res = await http({
          url:"posts/new/customized",
          data: { postId:id,ordersArr:ordersIdArr },
          method: "PUT",
        });
        navigate("/posts")
      }}>Save</Button>}
     </div>
    </Layout>
  );
}

export default Orders;
