import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import http from "../../utils/axios-instance";
import UserContext from "../../context/AppContext";

const schema = yup.object().shape({
  username: yup
    .string()
    .min(5, "Username nomi eng kamida 5 ta belgidan iborat bo'lishi kerak")
    .max(20, "Username 20 ta belgidan ko'p bo'lishi mumkin emas")
    .required("Username bo'sh bo'lishi mumkin emas"),
  password: yup
    .string()
    .min(6, "Parol  eng kamida 6 ta belgidan iborat bo'lishi kerak")
    .max(20, "Parol 20 ta belgidan ko'p bo'lishi mumkin emas")
    .required("Parol bo'sh bo'lishi mumkin emas"),
});

function Login() {
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const ctx = useContext(UserContext);
  console.log(ctx);
  const navigate = useNavigate();

  const login = async (data) => {
    try {
      const res = await http({
        url: "/auth/login",
        method: "POST",
        data,
      });
      localStorage.setItem("token", res.data.data.jwt);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      ctx.setAppData({
        user: JSON.parse(localStorage.getItem("user")),
        token: localStorage.getItem("token"),
        isAuth: true,
      });
      toast.success(res.data.message);
      reset();
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(login)}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            {...register("username")}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            {...register("password")}
          />
        </div>
        <div>
          <button>Sign In</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
