import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appActions } from "../store/index";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import useHttp from "../hooks/use-http";
import { loginSubmit } from "../apis/login-api";

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

const useLogin = () => {
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (data) => {
    try {
      const res = await loginSubmit(data);
      localStorage.setItem("token", res.data.jwt);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      dispatch(appActions.login(res.data));
      toast.success(res.message);
      reset();
      navigate("/home");
    } catch (error) {
      const err = await error.response.data;
      toast.error(err.message);
    }
  };

  return { register, handleSubmit, login };
};

export default useLogin;
