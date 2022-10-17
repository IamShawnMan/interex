import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import http from "../../utils/axios-instance";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  password: yup
    .string()
    .trim()
    .required("Parol bo'sh bo'lishi mumkin emas")
    .min(6, "Parol eng kamida 6 ta belgidan iborat bo'lishi mumkin emas")
    .max(20, "Parol 20 ta belgidan ko'p bo'lmasligi kerak"),
  username: yup
    .string()
    .trim()
    .required("Username bo'sh bo'lishi mumkin emas")
    .min(5, "Username 5 ta belgidan kop bolishi kerak")
    .max(20, "Username 20 ta belgidan kam bolishi kerak"),
});

function UpdatePassword({ id }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const passwordSubmit = async (data) => {
    console.log(data);
    try {
      const res = await http({
        url: `users/${id}/password`,
        data: data,
        method: "PUT",
      });
      toast.success(res.data.message);

      reset();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <form onSubmit={handleSubmit(passwordSubmit)}>
      <input
        type="password"
        placeholder="Yabgi Parol"
        {...register("password")}
      />
      <input
        type="text"
        placeholder="Usernameingizni tasdiqlang"
        {...register("username")}
      />
      {errors.password && <p>{errors.password.message}</p>}
      <button>Save password</button>
    </form>
  );
}

export default UpdatePassword;
