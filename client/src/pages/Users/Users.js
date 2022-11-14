import { useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import http from "../../utils/axios-instance";
import { useState } from "react";
import { BasicTable } from "../../components/Table/BasicTable";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import Switch from "../../components/Form/FormComponents/Switch/Switch";
import Button from "../../components/Form/FormComponents/Button/Button";
import AppContext from "../../context/AppContext";
function Users() {
  const [value, setValue] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const { user } = useContext(AppContext);
  const getAllUser = async () => {
    try {
      const res = await http({
        url: `/users?page=${page}&size=${size}`,
      });
      setValue(res.data.data.content);
      setPagination(res.data.data.pagination);
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };
  useEffect(() => {
    getAllUser();
  }, [page]);

  const userStatusChangeHandler = async ({ id, status }) => {
    try {
      const res = await http({
        url: `users/${id}/status`,
        data: { status },
        method: "PUT",
      });

      getAllUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const usersCols = [
    {
      id: "fullName",
      Header: "F.I.Sh",
      accessor: (user) => {
        return `${user.firstName} ${user.lastName}`;
      },
    },
    { id: "username", Header: "User Name", accessor: "username" },
    { id: "phoneNumber", Header: "Telefon raqam", accessor: "phoneNumber" },
    {
      id: "passportNumber",
      Header: "Passport raqam",
      accessor: "passportNumber",
    },
    { id: "status", Header: "Mansabi", accessor: "userRole" },
  ];
  const superAdminAction = [
    {
      id: "actions",
      Header: "actions",
      accessor: (user) => {
        return (
          <Link to={`/users/${user.id}`}>
            <Button
              size="iconSmall"
              name="icon"
              iconName="pen"
              btnStyle={{
                margin: "0 auto",
                width: "4rem",
              }}
            />
          </Link>
        );
      },
    },
    {
      id: "userStatus",
      Header: "Status",
      accessor: (user) => {
        const status = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
        return (
          <Switch
            onSwitch={userStatusChangeHandler.bind(null, {
              id: user.id,
              status,
            })}
            enabled={user.status === "ACTIVE"}
            style={{ margin: "0 auto" }}
          />
        );
      },
    },
  ];
  if (user.userRole === "SUPER_ADMIN") {
    usersCols.push(...superAdminAction);
  }
  return (
    <Layout pageName="Foydalanuvchilar">
      {user.userRole === "SUPER_ADMIN" && (
        <Link style={{ width: "10rem", display: "block" }} to="/users/new">
          <Button size="small" name="btn">
            Add User
          </Button>
        </Link>
      )}

      {value?.length > 0 ? (
        <BasicTable
          columns={usersCols}
          data={value}
          pagination={pagination}
          url="/users"
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}

export default Users;
