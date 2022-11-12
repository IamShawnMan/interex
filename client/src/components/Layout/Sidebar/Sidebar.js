import React, { useContext } from "react";
import styles from "./Sidebar.module.css";
import { Link, useNavigate } from "react-router-dom";
import UsersIcon from "../../../assets/icons/UsersIcon";
import AppContext from "../../../context/AppContext";
import http from "../../../utils/axios-instance";
import SettingIcon from "../../../assets/icons/SettingIcon";
import Recruitment from "../../../assets/icons/Recruitment";
import DashboardIcon from "../../../assets/icons/DashboardIcon";

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
      <div className={`${styles.mainMenu} ${styles.linksContainer}`}>
        <p
          className={`subtitle ${styles.subtitle} ${
            !open ? styles.displayNone : ""
          }`}
        >
          ASOSIY MENU
        </p>
        {(user.userRole === "SUPER_ADMIN" || user.userRole === "ADMIN") && (
          <Link
            to={"/users"}
            className={`${styles.sidebarLink} ${
              open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
            }`}
          >
            <DashboardIcon classname={styles.sidebarLinkSvg} />
            {open && <p className="h6">Foydalanuvchilar</p>}
          </Link>
        )}
        {user.userRole === "ADMIN" && (
          <Link
            to={"/packages"}
            className={`${styles.sidebarLink} ${
              open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
            }`}
          >
            <DashboardIcon classname={styles.sidebarLinkSvg} />
            {open && <p className="h6">Paketlar</p>}
          </Link>
        )}
        <Link
          to={
            user.userRole === "COURIER"
              ? "/orders/delivered"
              : user.userRole === "STORE_OWNER"
              ? "/orders/myorders"
              : "/orders"
          }
          className={`${styles.sidebarLink} ${
            open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
          }`}
        >
          <DashboardIcon classname={styles.sidebarLinkSvg} />
          {open && <p className="h6">Buyurtmalar</p>}
        </Link>

        {(user.userRole === "ADMIN" || user.userRole === "COURIER") && (
          <Link
            to={"/posts"}
            className={`${styles.sidebarLink} ${
              open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
            }`}
          >
            <DashboardIcon classname={styles.sidebarLinkSvg} />
            {open && <p className="h6">Pochtalar</p>}
          </Link>
        )}
        {user.userRole === "COURIER" && (
          <>
            <Link
              to="/new-post"
              className={`${styles.sidebarLink} ${
                open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
              }`}
            >
              <UsersIcon classname={styles.sidebarLinkSvg} />
              {open && <p className="h6">Pochta</p>}
            </Link>
            <Link
              to="/posts/rejected/orders"
              className={`${styles.sidebarLink} ${
                open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
              }`}
            >
              <UsersIcon classname={styles.sidebarLinkSvg} />
              {open && <p className="h6">Rejected Orders</p>}
            </Link>
          </>
        )}
        <Link
          className={`${styles.sidebarLink} ${
            open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
          }`}
        >
          <UsersIcon classname={styles.sidebarLinkSvg} />
          {open && <p className="h6">Department</p>}
        </Link>
      </div>
      <div className={`${styles.other} ${styles.linksContainer}`}>
        <p
          className={`subtitle ${styles.subtitle} ${
            !open ? styles.displayNone : ""
          }`}
        >
          OTHER
        </p>
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
