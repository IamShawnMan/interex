import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appActions } from "../../store/index";
import styles from "./Home.module.css";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandle = () => {
    localStorage.clear();
    dispatch(
      appActions.login({
        user: "",
        token: "",
      })
    );
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
