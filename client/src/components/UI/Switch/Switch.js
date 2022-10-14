import React, { useEffect } from "react";
import styles from "./Swich.module.css";

function Switch({ onSwich, enabled }) {
  const switchChangeHandler = async () => {
    await onSwich();
  };

  return (
    <div
      onClick={switchChangeHandler}
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

export default Switch;
