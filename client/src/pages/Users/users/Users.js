import { useEffect } from "react";
import { Link } from "react-router-dom";
import http from "../../../utils/axios-instance";
import { useState } from "react";
import { BasicTable } from "../../../components/table/BasicTable";
function Users() {
  const [value, setValue] = useState(null);
  const getAllUser=async()=>{
    const res = await http({
    url: "/users",
    method: "GET",
  });
 setValue( res.data.data.allUsers.rows)
  }
  useEffect(() => {
    getAllUser();
  },[]);

  const usersCols = [
    { Header: "First Name", accessor: "firstName" },
    { Header: "Last Name", accessor: "lastName" },
    { Header: "User Name", accessor: "username" },
    { Header: "Phone Number", accessor: "phoneNumber" },
    { Header: "Passport Number", accessor: "passportNumber" },
    { Header: "Role", accessor: "userRole" },
  ];

  return (
    <>
    <Link to="/users/new">Add User</Link>
    <br/>
    <Link to="/home">Home</Link>
      {value?.length > 0 ? (
        <BasicTable columns={usersCols} data={value} />
      ) : (
        <p>Malumotlar yoq</p>
      )}
 </>
    
  );
}

export default Users;
