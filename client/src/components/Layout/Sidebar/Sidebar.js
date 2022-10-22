import React, { useContext } from "react";
import styles from "./Sidebar.module.css";
import { Link, useNavigate } from "react-router-dom";
import UsersIcon from "../../../assets/icons/UsersIcon";
import AppContext from "../../../context/AppContext";
import http from "../../../utils/axios-instance";
import SettingIcon from "../../../assets/icons/SettingIcon";

function Sidebar(props) {
  const open = props.hasActive;
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
  return (
    <div className={`${styles.sidebar} ${!open ? styles.exit : ""}`}>
      <Link to={"/"} className={styles.headerLink}>
        <h1 className={`h1 ${styles.sidebarTitle}`}>
          {open ? "InterEX Uz" : "IEX Uz"}
        </h1>
      </Link>
      <div className={styles.mainMenu}>
        <p className={`subtitle ${styles.subtitle}`}>MAIN MENU</p>
        {(user.userRole === "SUPER_ADMIN" || user.userRole === "ADMIN") && (
          <Link
            to={"/users"}
            className={`${styles.sidebarLink} ${
              open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
            }`}
          >
            <UsersIcon classname={styles.sidebarLinkSvg} />
            {open && <p className="h6">Users</p>}
          </Link>
        )}
        {user.userRole === "ADMIN" && (
          <Link
            to={"/packages"}
            className={`${styles.sidebarLink} ${
              open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
            }`}
          >
            <UsersIcon classname={styles.sidebarLinkSvg} />
            {open && <p className="h6">Packages</p>}
          </Link>
        )}
        {(user.userRole === "STORE_OWNER" || user.userRole === "ADMIN") && (
          <Link
            to={"/orders"}
            className={`${styles.sidebarLink} ${
              open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
            }`}
          >
            <UsersIcon classname={styles.sidebarLinkSvg} />
            {open && <p className="h6">Orders</p>}
          </Link>
        )}
        <Link
          className={`${styles.sidebarLink} ${
            open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
          }`}
        >
          <UsersIcon classname={styles.sidebarLinkSvg} />
          {open && <p className="h6">Recruitment</p>}
        </Link>
        <Link
          className={`${styles.sidebarLink} ${
            open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
          }`}
        >
          <UsersIcon classname={styles.sidebarLinkSvg} />
          {open && <p className="h6">Schedule</p>}
        </Link>
        <Link
          className={`${styles.sidebarLink} ${
            open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
          }`}
        >
          <UsersIcon classname={styles.sidebarLinkSvg} />
          {open && <p className="h6">Department</p>}
        </Link>
      </div>
      <div className={styles.other}>
        <p className={`subtitle ${styles.subtitle}`}>OTHER</p>
        <Link
          className={`${styles.sidebarLink} ${
            open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
          }`}
        >
          <UsersIcon classname={styles.sidebarLinkSvg} />
          {open && <p className="h6">Support</p>}
        </Link>
        <Link
          className={`${styles.sidebarLink} ${
            open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
          }`}
        >
          <SettingIcon classname={styles.sidebarLinkSvg} />
          {open && <p className="h6">Settings</p>}
        </Link>
        <Link
          onClick={logoutHandle}
          className={`${styles.sidebarLink} ${
            open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
          }`}
        >
          <UsersIcon classname={styles.sidebarLinkSvg} />
          {open && <p className="h6">Log Out</p>}
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
