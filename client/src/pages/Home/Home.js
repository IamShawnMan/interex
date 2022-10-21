import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UpdatePassword from "../../components/UpdatePassword/UpdatePassword";
import Layout from "../../components/Layout/Layout";
import AppContext from "../../context/AppContext";
import http from "../../utils/axios-instance";
import styles from "./Home.module.css";
import Button from "../../components/Form/FormComponents/Button/Button";
import Select from "../../components/Form/FormComponents/Select/Select";
// import { useForm } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import Input from "../../components/Form/FormComponents/Input/Input";
// import Button from "../../components/Form/FormComponents/Button/Button";

// const schema = yup.object().shape({
//   firstName: yup
//     .string()
//     .trim()
//     .min(5, "Ism eng kamida 5ta belgi")
//     .required("FirstName bo'sh bo'lishi mumkin emas"),
//   lastName: yup.string().trim().required("LastName bo'sh bo'lishi mumkin emas"),
// });

function Home() {
  const [updatePassword, setUpdatePassword] = useState(false);
  const ctx = useContext(AppContext);
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const updateSelfPassword = () => {
    setUpdatePassword(!updatePassword);
  };

  return (
    <Layout pageName={"Bosh Sahifa"}>
      <div>
        <p
          onClick={updateSelfPassword}
          style={{
            cursor: "pointer",
          }}
        >
          {!updatePassword ? "UpdatePassword" : "Paroldan chiqish"}
        </p>
        {updatePassword && <UpdatePassword id={user.id} />}
      </div>

      {/* Selectning ishlatilishi */}
      {/* <div className={styles.select}>
        <Select data={viloyatlar}>Tumanlar</Select>
      </div> */}

      {/* Button componentining ishlatilishi */}
      {/* <span className={styles.button}>
        <Button disabled={false} name="icon" size="iconSmall" iconName="trash">
          Save
        </Button>
      </span> */}
    </Layout>
  );
}

export default Home;
