import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UpdatePassword from "../../components/UpdatePassword/UpdatePassword";
import Layout from "../../components/Layout/Layout";
import AppContext from "../../context/AppContext";
import http from "../../utils/axios-instance";

import styles from "./Home.module.css";

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

  return (
    <Layout>
      <div>
        <Link to="/users">Users</Link>
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

        <h1 className={styles.h1}>Welcome to the Interex.uz portal</h1>
        <h2 onClick={logoutHandle} className={styles.logout}>
          Log Out
        </h2>
      </div>
    </Layout>
  );
}

export default Home;
