import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext, { appActions } from "../../context/UserContext";
import styles from "./Home.module.css";

function Home() {
  const ctx = useContext(UserContext);
  console.log(ctx);
  const navigate = useNavigate();
  const logoutHandle = () => {
    localStorage.clear();
    ctx.onReset();
    navigate("/");
  };

  return (
    <div>
      <h1 className={styles.h1}>Welcome to the Interex.uz portal</h1>
      <h2 onClick={logoutHandle} className={styles.logout}>
        Log Out
      </h2>
    </div>
  );
}

export default Home;
