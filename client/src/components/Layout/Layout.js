import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";

import styles from "./Layout.module.css";

function Layout(props) {
  const [burger, setBurger] = useState(false);

  const sidebarActiveHandle = () => {
    setBurger(!burger);
  };
  return (
    <div>
      <Sidebar active={burger} />
      <div
        className={`${styles.container} ${!burger ? styles.containerFull : ""}`}
      >
        <Navbar sidebarActiveHandle={sidebarActiveHandle} />

        <div className={styles.contents}>{props.children}</div>
      </div>
    </div>
  );
}

export default Layout;
