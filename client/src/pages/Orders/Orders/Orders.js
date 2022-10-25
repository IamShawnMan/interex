import { useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import http from "../../../utils/axios-instance";
import { useState } from "react";
import { BasicTable } from "../../../components/Table/BasicTable";
import Layout from "../../../components/Layout/Layout";
import AppContext from "../../../context/AppContext";
import { toast } from "react-toastify";
import Button from "../../../components/Form/FormComponents/Button/Button";
function Orders() {
  const { user } = useContext(AppContext);
  const [value, setValue] = useState(null);
  const [pagination, setPagination] = useState({});
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 2;
  const getAllOrders = async () => {
    const res = await http({
      url: `/packages/myorders?page=${page}&size=${size}`,
    });
    console.log(res);
    setValue(res.data.data.myOrders.content);
    setPagination(res.data.data.myOrders.pagination);

  };
  useEffect(() => {
    getAllOrders();
  }, [page]);
  const changeOrderStatus = async (id, status) => {
    const res = await http({
      url: `/orders/${id}`,
      method: "PATCH",
      data: { orderStatus: status },
    });
    toast.success("Order Status Updated");
    getAllOrders();
  };
  const ordersCols = [
    { Header: "id", accessor: "id" },
    { Header: "DeliveryPrice", accessor: "deliveryPrice" },
    { Header: "OrderStatus", accessor: "orderStatus" },
    { Header: "Recipient", accessor: "recipient" },
    { Header: "TotalPrice", accessor: "totalPrice" },
    { Header: "packageId", accessor: "packageId" },
    { Header: "Note", accessor: "note" },
    { Header: "recipientPhoneNumber", accessor: "recipientPhoneNumber" },
    { Header: "Region", accessor: "region.name" },
    { Header: "District", accessor: "district.name" },
    {
      Header: "Action",
      accessor: (order) => {
        return (
          <div>
            {user.userRole === "STORE_OWNER" && (
             
                <Link style={{textDecoration: "none",color: "white"}} to={`/orders/${order.id}`}> <Button size="small" name="btn">Update</Button></Link>
           
              
            )}
            {user.userRole === "ADMIN" && (
              <>
              
                <Button
                size="small"
                name="btn"
                  // style={{ padding: "5px", margin: "2px", fontSize: "20px" }}
                  onClick={() => changeOrderStatus(order.id, "ACCEPTED")}
                >
                  ACCEPTED
                </Button>
                <Button
                size="small"
                name="btn"
                  style={{ padding: "5px", margin: "2px", fontSize: "20px" }}
                  onClick={() => changeOrderStatus(order.id, "NOT_EXIST")}
                >
                  <>NOT EXIST</>
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Layout pageName="Jo'natmalar Ro'yxati">
      {user.userRole === "STORE_OWNER" && (
        <Link style={{display: "block",width: "12rem"}} to="/orders/new"><Button size="small" name="btn">Add Order</Button></Link>
      )}
      {value?.length > 0 ? (
        <BasicTable columns={ordersCols} data={value} pagination={pagination}           url="orders"
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}

export default Orders;
