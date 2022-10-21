import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import Input from "../../Form/FormComponents/Input/Input";
import SearchIcon from "../../../assets/icons/SearchIcon";
import Burger from "../../../assets/icons/Burger";
import RoundNotifications from "../../../assets/icons/RoundNotifications";
import SmsIcon from "../../../assets/icons/SmsIcon";
import Arrow from "../../../assets/icons/Arrow";
import AppContext from "../../../context/AppContext";
import ArrowForBtn from "../../../assets/icons/ArrowForBtn";
import http from "../../../utils/axios-instance";

function Navbar(props) {
  const { user, onReset } = useContext(AppContext);
  const [show, setShow] = useState(false);
  const [arrowChange, setArrowChange] = useState(true);
  const navigate = useNavigate();
  const activeAndNotActiveHandler = () => {
    props.sidebarActiveHandle();
    setArrowChange(!arrowChange);
  };
  const logoutHandle = () => {
    localStorage.clear();
    onReset();
    navigate("/");
  };

  const modalShow = () => {
    setShow(!show);
  };

  return (
    <div className={styles.navbar}>
      <div
        onClick={activeAndNotActiveHandler}
        className={`${styles.arrowForBtn} ${
          !arrowChange ? styles.arrowRight : ""
        }`}
      >
        <ArrowForBtn />
      </div>
      <div className={styles.formControl}>
        <Input plascholder={"Search"} />
        <div className={styles.searchSvg}>
          <SearchIcon classname={styles.searchSvg} />
        </div>
      </div>
      <div className={styles.userInfo}>
        <div className={styles.RoundNotificationSvg}>
          <RoundNotifications classname={styles.RoundNotificationSvg} />
        </div>
        <div className={styles.SmsIcon}>
          <SmsIcon classname={styles.SmsIcon} />
        </div>
        <div className={styles.userMenu} onClick={modalShow}>
          <p className={`h6`}>{`${user.firstName} ${user.lastName}`}</p>
          <div className={styles.arrowSvg}>
            <Arrow classname={styles.arrowSvg} />
          </div>
          <div
            className={`${styles.userMenuModal} ${
              show ? styles.modalShow : ""
            }`}
          >
            <p
              onClick={logoutHandle}
              className={`h6 ${styles.userMenuModalItem}`}
            >
              Log Out
            </p>
            <Link
              className={`h6 ${styles.userMenuModalItem}`}
              to={`/settings/${user.id}`}
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
