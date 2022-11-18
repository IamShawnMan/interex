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
  const [info, setInfo] = useState(null);
  const [postStatus, setPostStatus] = useState(null);
  const [price, setPrice] = useState(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const createdAt = searchParams.get("createdAt") || "";
  const orderStatus = searchParams.get("orderStatus") || "";
  const regionId = searchParams.get("regionId") || "";
  const districtId = searchParams.get("districtId") || "";
  const storeOwnerId = !isStoreOwner ? searchParams.get("storeOwnerId") : "";
  const { id } = useParams();
  const navigate = useNavigate();
  const url = location.pathname;
  useEffect(() => {
    filterFn();
    getPrices();
  }, [
    page,
    info,
    orderStatus,
    regionId,
    districtId,
    storeOwnerId,
    createdAt,
    url,
  ]);
  const getPrices = async () => {
    const res = await http({
      url: "/orders/devprice",
    });
    setPrice(res.data);
  };
  const getAllOrders = async (data) => {
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
      filterFn();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const dailyOrders = async () => {
    const res = await http({
      url: "/orders/delivered/daily",
    });
    setValue(res.data.data.content);
    setPagination(res.data.data.pagination);
  };

  const getFile = async () => {
    const dateCreatedAt = new Date(createdAt ? createdAt : "");
    http({
      url: `orders/download?page=${page}&size=${size}${
        orderStatus ? `&orderStatus=${orderStatus}` : ""
      }${regionId ? `&regionId=${regionId}` : ""}${
        districtId ? `&districtId=${districtId}` : ""
      }${
        !isStoreOwner
          ? storeOwnerId
            ? `&storeOwnerId=${storeOwnerId}`
            : ""
          : ""
      }${createdAt ? `&createdAt[eq]=${dateCreatedAt.toISOString()}` : ""}`,
      method: "GET",
      responseType: "blob",
    }).then((res) => {
      const href = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "orders.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  };

  const cols = [
    {
      id: "id",
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Manzil",
      accessor: (order) => {
        return (
          <>
            {order.region.name}
            <br />
            {order.district.name}
          </>
        );
      },
    },
    { id: "status", Header: "Holati", accessor: "orderStatus" },
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
            {order.status !== "NEW" &&
              order.deliveryPrice?.toLocaleString("Ru-Ru")}
          </>
        );
      },
    },
    {
      id: "totalPrice",
      Header: "Mahsulotning narxi",
      accessor: (order) => {
        return <>{`${order.totalPrice.toLocaleString("Ru-Ru")} so'm`}</>;
      },
    },
    {
      id: "updatedAt",
      Header: "Oxirgi o'zgarish",
      accessor: (order) => {
        return formatDate(order.updatedAt);
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
            {isCourier &&
              (order.orderStatus === "DELIVERED" ||
                order.orderStatus === "PENDING") &&
              (order.orderStatus === "DELIVERED" ||
                order.orderStatus === "SOLD" ||
                order.orderStatus !== "PENDING" ||
                order.orderStatus !== "REJECTED") &&
              order.orderStatus !== "DELIVERING" && (
                <>
                  <Button
                    name="btn"
                    disabled={
                      order.orderStatus === "SOLD" ||
                      order.orderStatus === "REJECTED" ||
                      order.orderStatus === "NOT_DELIVERED"
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
                      order.orderStatus === "PENDING" ||
                      order.orderStatus === "NOT_DELIVERED"
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
                      order.orderStatus === "REJECTED" ||
                      order.orderStatus === "NOT_DELIVERED"
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
            {ordersIdArr && (url.split("/")[1] === "postback" || id) && (
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
      toast.error(error?.response?.data?.message);
    }
    navigate("/posts");
  };
  const postRejectedCreateOrUpdateFn = async () => {
    try {
      const res = await http({
        url: "/postback/new/rejected",
        data: { ordersArr: ordersIdArr },
        method: "POST",
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    navigate("/postback");
  };
  const filterFn = async () => {
    const dateCreatedAt = new Date(createdAt ? createdAt : "");
    try {
      const res = await http({
        url: `${url}?page=${page}&size=${size}${
          orderStatus ? `&orderStatus=${orderStatus}` : ""
        }${regionId ? `&regionId=${regionId}` : ""}${
          districtId ? `&districtId=${districtId}` : ""
        }${
          !isStoreOwner
            ? storeOwnerId
              ? `&storeOwnerId=${storeOwnerId}`
              : ""
            : ""
        }${createdAt ? `&createdAt[eq]=${dateCreatedAt.toISOString()}` : ""}`,
      });
      getAllOrders(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const closeHandler = () => {
    setInfo(false);
  };
  return (
    <Layout pageName="Jo'natmalar Ro'yxati">
      {(url === "/orders" ||
        url === "/orders/delivered" ||
        url === "/orders/myorders") && (
        <Button
          type="button"
          name="btn"
          btnStyle={{ width: "9rem", marginBottom: ".5rem" }}
          onClick={() => getFile()}
        >
          Download
        </Button>
      )}
      <div>
        {isStoreOwner && (
          <Button
            name="iconText"
            iconName="plus"
            onClick={() => {
              navigate("/orders/new");
            }}
            btnStyle={{ width: "13rem" }}
          >
            Buyurtma
          </Button>
        )}
        {isCourier &&
          (url === "/orders" ||
            url === "/orders/delivered" ||
            url === "/orders/myorders") && (
            <div style={{ display: "flex", gap: "2rem", width: "50%" }}>
              <Button
                style={{ width: "13rem" }}
                name="btn"
                onClick={dailyOrders}
              >
                Bugungilar
              </Button>
              <Button
                style={{ width: "13rem" }}
                name="btn"
                onClick={
                  url === "/postback/rejected/orders"
                    ? () => {
                        navigate("/postback");
                      }
                    : filterFn
                }
              >
                Hammasi
              </Button>
            </div>
          )}
      </div>
      {(url === "/orders" ||
        url === "/orders/delivered" ||
        url === "/orders/myorders") && <Filter filterFn={filterFn} url={url} />}
      {value?.length > 0 ? (
        <BasicTable
          columns={cols}
          data={value}
          pagination={
            (url === "/orders" ||
              url === "/orders/delivered" ||
              url === "/orders/myorders") &&
            pagination
          }
          url={url}
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
      {info && typeof info !== "object" && (
        <OrderInfo id={info} onClose={closeHandler} />
      )}
      {info && typeof info === "object" && (
        <PostSendCourier id={info} url={url} onClose={closeHandler} />
      )}
      <div style={{ display: "flex", gap: 1 }}>
        {(url.split("/")[1] === "posts" || url.split("/")[2] === "rejected") &&
          (postStatus === "NEW" ||
            url.split("/")[3] === "regionorders" ||
            url.split("/")[2] === "rejected") && (
            <Button
              type="submit"
              size="small"
              name="btn"
              disabled={value.length === 0}
              onClick={
                url.split("/")[2] === "rejected"
                  ? postRejectedCreateOrUpdateFn
                  : postCreateOrUpdateFn
              }
            >
              {url.split("/")[3] === "regionorders" ||
              url.split("/")[2] === "rejected"
                ? "create"
                : "update"}
            </Button>
          )}
      </div>
    </Layout>
  );
}

export default Orders;
