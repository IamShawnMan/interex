import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UpdatePassword from "../../components/UpdatePassword/UpdatePassword";
import Layout from "../../components/Layout/Layout";
import AppContext from "../../context/AppContext";
import http from "../../utils/axios-instance";
import styles from "./Home.module.css";
// import { useForm } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import Input from "../../components/Form/FormComponents/Input/Input";
// import Button from "../../components/Form/FormComponents/Button/Button";

// const schema = yup.object().shape({
//   firstName: yup
//     .string()
//     .trim()
//     .min(5, "Ism eng kamida 5ta belgi")
//     .required("FirstName bo'sh bo'lishi mumkin emas"),
//   lastName: yup.string().trim().required("LastName bo'sh bo'lishi mumkin emas"),
// });

function Home() {
  const [updatePassword, setUpdatePassword] = useState(false);
  const ctx = useContext(AppContext);
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const logoutHandle = () => {
    localStorage.clear();
    ctx.onReset();
    http({
      headers: {
        authorization: "",
      },
    });
    navigate("/");
  };

  const updateSelfPassword = () => {
    setUpdatePassword(!updatePassword);
  };

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  // } = useForm({
  //   mode: "onBlur",
  //   resolver: yupResolver(schema),
  // });

  return (
    <Layout>
      <div>
        <Link to="/users">Users</Link>
        <br />
        <br />
        {/* <form
          onSubmit={handleSubmit((data) => {
            console.log(data);
          })}
        >
          <Input
            register={register.bind(null, "firstName")}
            type="text"
            plascholder="First Name"
            id="firstName"
            error={errors.firstName?.message || ""}
          />
          <Input
            register={register.bind(null, "lastName")}
            type="file"
            plascholder="Last Name"
            id="lastName"
            error={errors.lastName?.message || ""}
          />
          <Button title={"Save"} />
        </form> */}
        <br />

        <p
          onClick={updateSelfPassword}
          style={{
            cursor: "pointer",
          }}
        >
          {!updatePassword ? "UpdatePassword" : "Paroldan chiqish"}
        </p>
        <br />
        <br />
        {updatePassword && <UpdatePassword id={user.id} />}

        {user.userRole === "STORE_OWNER" && <Link to="/orders">Orders</Link>}
        {user.userRole === "ADMIN" && <Link to="/packages">Packages</Link>}
        <h1 className={styles.h1}>Welcome to the Interex.uz portal</h1>
        <h2 onClick={logoutHandle} className={styles.logout}>
          Log Out
        </h2>
      </div>
    </Layout>
  );
}

export default Home;
