import React, { useEffect } from "react";
import styles from "./Swich.module.css";

function Swich({ fn, fnConfig, isActive }) {
  const swichChangeHandler = async () => {
    await fn({ ...fnConfig });
  };

  return (
    <div
      onClick={swichChangeHandler}
      className={`${styles.swichMutation} ${
        isActive ? styles.swichMutationActive : ""
      }`}
    >
      <div
        className={`${styles.swichMutationChild} ${
          isActive ? styles.swichActive : ""
        }`}
      ></div>
    </div>
  );
}

export default Swich;
