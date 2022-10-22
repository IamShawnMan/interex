import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";
import ArrrowForBtn from "../../assets/icons/ArrowForBtn";
import styles from "./Layout.module.css";

function Layout(props) {
  const [arrowChange, setArrowChange] = useState(true);

  const sidebarActiveHandle = () => {
    setArrowChange(!arrowChange);
  };
  return (
    <div className={styles.layout}>
      <Sidebar hasActive={arrowChange} />
      <div
        className={`${styles.container} ${
          !arrowChange ? styles.containerFull : ""
        }`}
      >
        <Navbar sidebarActiveHandle={sidebarActiveHandle} />
        <div className={styles.layoutBox}>
          <div className={styles.pathRoad}>
            <h1 className={`h2 ${styles.pageName}`}>{props.pageName}</h1>
          </div>
          <div className={styles.contents}>{props.children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
