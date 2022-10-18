import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import http from "../../utils/axios-instance";
import UserContext from "../../context/AppContext";
import styles from "./Login.module.css";
import img from "./img.png";
import passwordimg from "./password.png";
import userimg from "./user.png";
const schema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required("Username bo'sh bo'lishi mumkin emas")
    .min(5, "Username xato kiritildi")
    .max(20, "Username xato kiritildi"),
  password: yup
    .string()
    .trim()
    .required("Parol bo'sh bo'lishi mumkin emas")
    .min(6, "Parol  xato kiritildi")
    .max(20, "Parol xato kiritildi"),
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const ctx = useContext(UserContext);
  const navigate = useNavigate();

  const login = async (data) => {
    try {
      const res = await http({
        url: "/auth/login",
        method: "POST",
        data,
      });
      console.log(res);
      localStorage.setItem("token", res.data.data.jwt);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      ctx.setAppData({
        user: JSON.parse(localStorage.getItem("user")),
        token: localStorage.getItem("token"),
        isAuth: true,
      });
      toast.success(res.data.message);
      navigate("/home");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles["left-page"]}>
        <h1>“InterEX Uz poskal service”</h1>
        <img src={img} alt="img" />
      </div>
      <div className={styles["right-page"]}>
        <div className={styles["right-page-main-content"]}>
          <h1>Tizimga Kirish</h1>

          <form onSubmit={handleSubmit(login)}>
            <div>
              <label htmlFor="username">
                <div className={styles.spandiv}>
                  <span className={styles["input-name"]}>Username </span>
                  <span className={styles["input-icon"]}>
                    <img src={userimg} alt="userimg" />
                  </span>
                </div>
                <input
				style={{borderBottom: errors.username&&"1px solid red"}}
				size="42"
                  type="text"
                  id="username"
                  name="username"
                  {...register("username")}		
                />
                <i></i>
              </label>
              {errors.username && <p style={{color:"red"}}>{errors.username.message}</p>}
            </div>
            <div>
              <label htmlFor="password">
                <div className={styles.spandiv}>
                  <span className={styles["input-name"]}>Parol </span>
                  <span className={styles["input-icon"]}>
                    <img src={passwordimg} alt="passwordimg" />
                  </span>
                </div>

                <input
				style={{borderBottom: errors.password&&"1px solid red"}}
				size="42"
                  type="password"
                  name="password"
                  id="password"
                  {...register("password")}
                />
              </label>
              {errors.password && <p style={{color:"red"}}>{errors.password.message}</p>}
            </div>
            <div>
              <button type="submit" className={styles.signin}>Kirish</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
