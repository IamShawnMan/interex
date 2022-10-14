import React, { useEffect } from "react";
import styles from "./Swich.module.css";

function Swich({ onSwich, enabled }) {
  const swichChangeHandler = async () => {
    await onSwich();
  };

  return (
    <div
      onClick={swichChangeHandler}
      className={`${styles.toggleButton} ${
        enabled ? styles.buttonEnabled : ""
      }`}
    >
      <div
        className={`${styles.toggle} ${enabled ? styles.toggleEnabled : ""}`}
      ></div>
    </div>
  );
}

export default Swich;
