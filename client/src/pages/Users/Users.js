import { useEffect } from "react";
import { Link } from "react-router-dom";
import http from "../../utils/axios-instance";
import { useState } from "react";
import { BasicTable } from "../../components/Table/BasicTable";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import styles from "./Users.module.css";
import Switch from "../../components/UI/Switch/Switch";
function Users() {
  const [value, setValue] = useState([]);
  const getAllUser = async () => {
    try {
      const res = await http({
        url: "/users",
      });
      setValue(res.data.data.allUsers.content);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    getAllUser();
  }, []);

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
      console.log(error.response.data);
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
    {
      id: "actions",
      Header: "actions",
      accessor: (user) => {
        return <Link to={`/users/${user.id}`}>Update</Link>;
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
          />
        );
      },
    },
  ];

  return (
    <Layout>
      <Link to="/users/new">Add User</Link>
      {value?.length > 0 ? (
        <BasicTable columns={usersCols} data={value} />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}

export default Users;
