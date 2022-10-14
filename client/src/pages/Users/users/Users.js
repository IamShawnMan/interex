import { useEffect } from "react";
import { Link } from "react-router-dom";
import http from "../../../utils/axios-instance";
import { useState } from "react";
import { BasicTable } from "../../../components/Table/BasicTable";
import Layout from "../../../components/Layout/Layout";
import { toast } from "react-toastify";
import styles from "./Users.module.css";
import Swich from "../../../components/UI/Swich/Swich";
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
    const isActive = !status;
    try {
      const res = await http({
        url: `/users/${id}/status/${isActive ? "ACTIVE" : "BLOCKED"}`,
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
        const isActive = user.status === "ACTIVE";

        return (
          <Swich
            fn={userStatusChangeHandler}
            fnConfig={{ id: user.id, status: isActive }}
            isActive={isActive}
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
