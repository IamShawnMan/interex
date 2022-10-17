import React from "react";
import styles from "./Switch.module.css";

function Switch({ onSwitch, enabled }) {
  const switchChangeHandler = async () => {
    await onSwitch();
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
