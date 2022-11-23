import React, { useContext } from "react";
import styles from "./Sidebar.module.css";
import { Link, useNavigate } from "react-router-dom";
import UsersIcon from "../../../assets/icons/UsersIcon";
import AppContext from "../../../context/AppContext";
import http from "../../../utils/axios-instance";
import SettingIcon from "../../../assets/icons/SettingIcon";
import Recruitment from "../../../assets/icons/Recruitment";
import DashboardIcon from "../../../assets/icons/DashboardIcon";
import XButtonIcon from "../../../assets/icons/XButtonIcon";

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
    <>
      <div className={`${styles.sidebar} ${!open ? styles.exit : ""}`}>
        <div className={styles.xButtonIcon} onClick={props.sidebarActiveHandle}>
          <XButtonIcon />
        </div>
        <div className={styles.headerLink}>
          <Link to={"/"} className={styles.headerA}>
            <h1 className={`h1 ${styles.sidebarTitle}`}>
              {open ? "InterEX Uz" : "IEX Uz"}
            </h1>
          </Link>
        </div>

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
              {
                <p
                  className={`h6 ${!open ? styles.linkP_hidden : styles.linkP}`}
                >
                  Foydalanuvchilar
                </p>
              }
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
            <p className={`h6 ${!open ? styles.linkP_hidden : styles.linkP}`}>
              Buyurtmalar
            </p>
          </Link>
          {user.userRole === "STORE_OWNER" && (
            <Link
              to={"/packageback"}
              className={`${styles.sidebarLink} ${
                open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
              }`}
            >
              <DashboardIcon classname={styles.sidebarLinkSvg} />
              <p className={`h6 ${!open ? styles.linkP_hidden : styles.linkP}`}>
                Paketlar
              </p>
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
              <p className={`h6 ${!open ? styles.linkP_hidden : styles.linkP}`}>
                Paketlar
              </p>
            </Link>
          )}
          {user.userRole === "ADMIN" && (
            <Link
              to={"/post/create"}
              className={`${styles.sidebarLink} ${
                open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
              }`}
            >
              <DashboardIcon classname={styles.sidebarLinkSvg} />
              <p className={`h6 ${!open ? styles.linkP_hidden : styles.linkP}`}>
                Pochtalar
              </p>
            </Link>
          )}
        </div>
        <div className={`${styles.other} ${styles.linksContainer}`}>
          <p
            className={`subtitle ${styles.subtitle} ${
              !open ? styles.displayNone : ""
            }`}
          >
            Boshqalar
          </p>
          <Link
            className={`${styles.sidebarLink} ${
              open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
            }`}
          >
            <UsersIcon classname={styles.sidebarLinkSvg} />
            <p className={`h6 ${!open ? styles.linkP_hidden : styles.linkP}`}>
              Yordam
            </p>
          </Link>
          <Link
            className={`${styles.sidebarLink} ${
              open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
            }`}
          >
            <SettingIcon classname={styles.sidebarLinkSvg} />
            <p className={`h6 ${!open ? styles.linkP_hidden : styles.linkP}`}>
              Sozlamalar
            </p>
          </Link>
          <Link
            onClick={logoutHandle}
            className={`${styles.sidebarLink} ${
              open ? styles.sidebarLinkOpen : styles.sidebarLinkClouse
            }`}
          >
            <UsersIcon classname={styles.sidebarLinkSvg} />
            <p className={`h6 ${!open ? styles.linkP_hidden : styles.linkP}`}>
              Chiqish
            </p>
          </Link>
        </div>
      </div>
      <div
        className={`${styles.sidebarModal} ${
          open ? styles.displayNone : styles.displayBlock
        }`}
        onClick={props.sidebarActiveHandle}
      ></div>
    </>
  );
}

export default Sidebar;
