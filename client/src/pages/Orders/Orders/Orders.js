import { useContext, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
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
  let filterFn;

  const getAllMyOrders = async (data) => {
    console.log(data);
    setValue(data.myOrders.content);
    setPagination(data.myOrders.pagination);
  };

  const getAllOrders = async (data) => {
    setValue(data.allOrders.content);
    setPagination(data.allOrders.pagination);
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
    { id: "totalPrice", Header: "Malhulotning narxi", accessor: "totalPrice" },
    {
      Header: "Sanasi",
      accessor: (order) => {
        return formatDate(order.createdAt);
      },
    },
  ];

  const action = {
    Header: "Action",
    accessor: (order) => {
      return (
        <div>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={`/orders/${order.id}`}
          >
            <Button size="small" name="btn">
              Update
            </Button>
          </Link>
        </div>
      );
    },
  };

  if (isStoreOwner) {
    filterFn = getAllMyOrders;
  } else if (isAdmin || isSuperAdmin) {
    filterFn = getAllOrders;
  }

  const ordersCols = isStoreOwner ? cols.push(action) : cols;

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
        url={
          ((isAdmin || isSuperAdmin) && `orders`) ||
          (isStoreOwner && `packages/myorders`)
        }
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
