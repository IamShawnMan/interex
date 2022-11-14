import React, { useContext, useEffect } from "react";
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
import OrderInfo from "../OrderInfo/OrderInfo";
import PostSendCourier from "../../Posts/PostSendCourier";
function Orders() {
  const { user } = useContext(AppContext);
  const isAdmin = user.userRole === "ADMIN";
  const isStoreOwner = user.userRole === "STORE_OWNER";
  const isCourier = user.userRole === "COURIER";
  const [pagination, setPagination] = useState(null);
  const [value, setValue] = useState(null);
  const [ordersIdArr, setOrdersIdArr] = useState(null);
  const [price, setPrice] = useState(null);
  const [info, setInfo] = useState(null);
  const [postStatus, setPostStatus] = useState(null);
  const [allQueries, setQueries] = useState(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const { id } = useParams();
  const navigate = useNavigate();
  const url = location.pathname;
  useEffect(() => {
    filterFn(allQueries);
    getPrices();
  }, [page, info,url]);
  const getPrices = async () => {
    const res = await http({
      url: "/orders/devprice",
    });
    setPrice(res.data);
  };
  const getAllOrders = async (data) => {
    console.log(data);
    setValue(data?.data?.content);
    setPagination(data?.data?.pagination);
    setOrdersIdArr(data?.data?.ordersArrInPost);
    setPostStatus(data?.data?.currentPostStatus?.postStatus);
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

  const getFile = async () => {
    http({
      url: "orders/download",
      method: "GET",
      responseType: "blob", 
    }).then((res) => {
      const href = URL.createObjectURL(res.data)
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "orders.xlsx")
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
  })
  }

  const cols = [
    {
      id: "id",
      Header: "NO",
      accessor: (_, i) => {
        return `${i + 1}`;
      },
    },
    { Header: "Haridor", accessor: "recipient" },
    { id: "status", Header: "Holati", accessor: "orderStatus" },
    { Header: "Telefon", accessor: "recipientPhoneNumber" },
    { Header: "Eslatma", accessor: "note" },
    { Header: "Viloyat", accessor: "region.name" },
    { Header: "Tuman", accessor: "district.name" },
    {
      id: "deliveryPrice",
      Header: "Yetkazish narxi",
      accessor: (order) => {
        return (
          <>
            {order.orderStatus === "NEW" && id && (
              <Select
                data={price?.map((e) => {
                  return { id: e, name: e };
                })}
                onChange={async (e) => {
                  console.log(e.target.value);
                  const res = await http({
                    url: `orders/${order.id}/devprice`,
                    method: "PATCH",
                    data: { deliveryPrice: e.target.value },
                  });
                }}
              >
                Narxi
              </Select>
            )}
            {order.status !== "NEW" &&(order.deliveryPrice)?.toLocaleString("Ru-Ru")}
          </>
        );
      },
    },
    { id: "totalPrice", Header: "Mahsulotning narxi", accessor: (order)=>{
      return(
        <>
        {(order.totalPrice).toLocaleString("Ru-Ru")}
        </>
      )
    } },
    {
      Header: "Sanasi",
      accessor: (order) => {
        const dateNew=new Date(order.createdAt)
        return (
          <>
             {dateNew.getDate()}/
             {dateNew.getMonth()+1}/
             {dateNew.getFullYear()}
             <br/>
             {dateNew.getHours()}:{dateNew.getMinutes()}:{dateNew.getSeconds()}
          </>
        );
      },
    },
    {
      Header: "Tugma",
      accessor: (order) => {
        return (
          <div className={styles.actionContainer}>
            {((isAdmin && url.split("/")[1] !== "posts") || isStoreOwner) && (
              <div className={styles.actionContainer}>
                {user.userRole === "STORE_OWNER" && (
                  <Button
                    size="small"
                    disabled={order.orderStatus !== "NEW" ? true : false}
                    name="btn"
                    onClick={() => {
                      navigate(`/orders/${order.id}`);
                    }}
                  >
                    O'zgartirish
                  </Button>
                )}
                {isAdmin && id && (
                  <>
                    <Button
                      name="btn"
                      disabled={order.orderStatus === "NEW" ? false : true}
                      onClick={() => changeOrderStatus(order.id, "ACCEPTED")}
                    >
                      Qabul qilindi
                    </Button>

                    <Button
                      disabled={order.orderStatus === "NEW" ? false : true}
                      size="small"
                      name="btn"
                      onClick={() => changeOrderStatus(order.id, "NOT_EXIST")}
                    >
                      Qabul qilinmadi
                    </Button>
                  </>
                )}
              </div>
            )}
            {isCourier&&(order.orderStatus === "DELIVERED"||order.orderStatus === "PENDING")&&
              (order.orderStatus === "DELIVERED" ||
                order.orderStatus === "SOLD" ||
                order.orderStatus !== "PENDING" ||
                order.orderStatus !== "REJECTED") &&order.orderStatus!=="DELIVERING"&& (
                <>
                  <Button
                    name="btn"
                    disabled={
                      order.orderStatus === "SOLD" ||
                      order.orderStatus === "REJECTED"||order.orderStatus==="NOT_DELIVERED"
                        ? true
                        : false
                    }
                    onClick={() => {
                      setInfo({ id: order.id, status: "SOLD" });
                    }}
                  >
                    Sotildi
                  </Button>

                  <Button
                    disabled={
                      order.orderStatus === "SOLD" ||
                      order.orderStatus === "REJECTED" ||
                      order.orderStatus === "PENDING"||order.orderStatus==="NOT_DELIVERED"
                        ? true
                        : false
                    }
                    size="small"
                    name="btn"
                    onClick={() => {
                      setInfo({ id: order.id, status: "PENDING" });
                    }}
                  >
                    Kutilmoqda
                  </Button>
                  <Button
                    disabled={
                      order.orderStatus === "SOLD" ||
                      order.orderStatus === "REJECTED"||order.orderStatus==="NOT_DELIVERED"
                        ? true
                        : false
                    }
                    size="small"
                    name="btn"
                    onClick={() => {
                      setInfo({ id: order.id, status: "REJECTED" });
                    }}
                  >
                    Qaytdi
                  </Button>
                </>
              )}
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
  const postCreateOrUpdateFn = async () => {
    try {
      const res = await http({
        url: url
          ? url.split("/")[3] === "regionorders"
            ? "posts/new"
            : "posts/new/customized"
          : "",
        data: url
          ? url.split("/")[3] === "regionorders"
            ? { regionId: id, ordersArr: ordersIdArr }
            : { postId: id, ordersArr: ordersIdArr }
          : "",
        method: url
          ? url.split("/")[3] === "regionorders"
            ? "POST"
            : "PUT"
          : "",
      });
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
    navigate("/posts");
  };
  const postRejectedCreateOrUpdateFn = async () => {
    console.log(ordersIdArr);
    try {
      const res = await http({
        url:"/postback/new/rejected",
        data:  {ordersArr: ordersIdArr },
        method: "POST",
      });
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
    navigate("/posts");
  };
  const filterFn = async (data) => {
    setQueries(data);
    const dateCreatedAt = new Date(data?.createdAt);
    try {
      const res = await http({
        url: `${url}?page=${page}&size=${size}${
          data?.status ? `&orderStatus=${data.status}` : ""
        }${data?.regionId ? `&regionId=${data.regionId}` : ""}${
          data?.districtId ? `&districtId=${data.districtId}` : ""
        }${
          !isStoreOwner
            ? data?.storeOwnerId
              ? `&storeOwnerId=${data.storeOwnerId}`
              : ""
            : ""
        }${
          data?.createdAt ? `&createdAt[eq]=${dateCreatedAt.toISOString()}` : ""
        }`,
      });
      getAllOrders(res.data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  const closeHandler = () => {
    setInfo(false);
  };
  return (
    <Layout pageName="Jo'natmalar Ro'yxati">
      {isStoreOwner && (
        <Button
          name="iconText"
          iconName="plus"
          onClick={() => {
            navigate("/orders/new");
          }}
          btnStyle={{ width: "13rem" }}
        >
          Yetkazma
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
      {info && typeof info !== "object" && (
        <OrderInfo id={info} onClose={closeHandler} />
      )}
      {info && typeof info === "object" && (
        <PostSendCourier
          id={info}
          url={url}
          onClose={() => {
            setInfo(false);
          }}
        />
      )}
      <div style={{ display: "flex", gap: 1 }}>
        {console.log(url)}
        {(url.split("/")[1] === "posts"||url.split("/")[2] === "rejected") &&
          (postStatus === "NEW" || url.split("/")[3] === "regionorders"||url.split("/")[2] === "rejected") && (
            <Button
              type="submit"
              size="small"
              name="btn"
              onClick={url.split("/")[2] === "rejected"?postRejectedCreateOrUpdateFn:postCreateOrUpdateFn}
            >
              {url.split("/")[3] === "regionorders"||url.split("/")[2] === "rejected" ? "create" : "update"}
            </Button>
          )}
      </div>
      <div onClick={() => getFile()}>Download</div>
    </Layout>
  );
}

export default Orders;
