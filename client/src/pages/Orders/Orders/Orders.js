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
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 2;
  const { user } = useContext(AppContext);
  const superAdmin = user.userRole === "SUPER_ADMIN";
  const admin = user.userRole === "ADMIN";
  const storeOwner = user.userRole === "STORE_OWNER";
  const courier = user.userRole === "COURIER";
  const [value, setValue] = useState(null);
  const [pagination, setPagination] = useState({});
  const getAllMyOrders = async (data) => {
    const res = await http({
      url: `/packages/myorders?page=${page}&size=${size}`,
    });
    setValue(res.data.data.myOrders.content);
    setPagination(res.data.data.myOrders.pagination);
  };

  const getAllOrders = async (data) => {
    const res = await http({
      url: "/orders",
    });
    setValue(res.data.data.allOrders.content);
    setPagination(res.data.data.allOrders.pagination);
  };
  useEffect(() => {
    if (storeOwner) {
      getAllMyOrders();
    } else if (admin || superAdmin) {
      getAllOrders();
    }
  }, [page]);

  const cols = [
    { id: "id", Header: "ID", accessor: "id" },
    { id: "recipient", Header: "Haridor", accessor: "recipient" },
    { id: "phoneNumber", Header: "Telefon", accessor: "recipientPhoneNumber" },
    { id: "note", Header: "Eslatma", accessor: "note" },
    { id: "status", Header: "Holati", accessor: "orderStatus" },
    { id: "region", Header: "Viloyat", accessor: "regionId" },
    { id: "district", Header: "Tum/Shah", accessor: "districtId" },
    {
      id: "packageId",
      Header: "Do'kon nomi",
      accessor: (o) => {
        return `${o.package.storeOwner.firstName} ${o.package.storeOwner.lastName}`;
      },
    },
    {
      id: "deliveryPrice",
      Header: "Yetkazish narxi",
      accessor: "deliveryPrice",
    },
    { id: "totalPrice", Header: "Malhulotning narxi", accessor: "totalPrice" },
    {
      Header: "Sanasi",
      accessor: (o) => {
        return formatDate(o.createdAt);
      },
    },
  ];

  const action = {
    Header: "Action",
    accessor: (order) => {
      return (
        <div>
          {storeOwner && (
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to={`/orders/${order.id}`}
            >
              {" "}
              <Button size="small" name="btn">
                Update
              </Button>
            </Link>
          )}
        </div>
      );
    },
  };

  const ordersCols = storeOwner ? cols.push(action) : cols;

  return (
    <Layout pageName="Jo'natmalar Ro'yxati">
      {user.userRole === "STORE_OWNER" && (
        <Link style={{ display: "block", width: "12rem" }} to="/orders/new">
          <Button size="small" name="btn">
            Add Order
          </Button>
        </Link>
      )}
      <Filter
        url={
          ((admin || superAdmin) && `orders?page=${page}&size=${size}`) ||
          (storeOwner && `packages/myorders?page=${page}&size=${size}`)
        }
        filterFn={
          ((admin || superAdmin) && getAllOrders) ||
          (storeOwner && getAllMyOrders)
        }
      />
      {value?.length > 0 ? (
        <BasicTable
          columns={ordersCols}
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
