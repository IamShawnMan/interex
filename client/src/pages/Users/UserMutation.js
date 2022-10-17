import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import http from "../../utils/axios-instance";
import { toast } from "react-toastify";
import Layout from "../../components/Layout/Layout";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("FirstName bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("LastName bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Username bo'sh bo'lishi mumkin emas")
    .min(5, "Username 5 ta belgidan kop bolishi kerak")
    .max(20, "Username 20 ta belgidan kam bolishi kerak"),
  password: yup
    .string()
    .trim()
    .required("Parol bo'sh bo'lishi mumkin emas")
    .min(6, "Parol 6 ta belgidan kop bolishi kerak")
    .max(20, "Parol 20 ta belgidan kam bolishi kerak"),
});
const UserMutation = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [roles, setRoles] = useState(null);
  const [regions, setRegions] = useState(null);
  const { id } = useParams();
  const isUpdate = id !== "new";
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (isUpdate) {
      try {
        getById();
      } catch (error) {}
    }
    getAllUserRoles();
    getAllRegions();
  }, []);

  const getAllUserRoles = async () => {
    const res = await http({
      url: "/users/roles",
    });
    setRoles(res.data.data.roles);
  };
  const getAllRegions = async () => {
    const res = await http({
      url: "/regions",
    });
    setRegions(res.data.data.allRegions);
  };

  const getById = async () => {
    const res = await http({
      url: `/users/${id}`,
    });
    reset(res.data.data.userById);
  };
  const formSubmit = async (data) => {
    console.log(data);
    try {
      const res = await http({
        url: isUpdate ? `/users/${id}` : "/users",
        method: isUpdate ? "PUT" : "POST",
        data,
      });
      console.log(res);
      toast.success(res.data.message);
      navigate("/users");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Layout>
        <form
          onSubmit={handleSubmit((data) => formSubmit(data))}
          className="form"
        >
          <select
            {...register("userRole")}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value={null}>Foydalanuvchi mansabi</option>
            {roles &&
              roles.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>

          <label htmlFor="text"></label>
          <input
            id="text"
            className="input"
            type="text"
            placeholder="firstName"
            {...register("firstName")}
          />
          {errors.firstName && <p>{errors.firstName.message}</p>}
          <label htmlFor="text"></label>
          <input
            id="text"
            className="input"
            type="text"
            placeholder="lastName"
            {...register("lastName")}
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}
          <label htmlFor="text"></label>
          <input
            id="text"
            className="input"
            type="text"
            placeholder="username"
            {...register("username")}
          />
          {errors.username && <p>{errors.username.message}</p>}
          {!isUpdate && (
            <>
              <label htmlFor="password"></label>
              <input
                id="password"
                className="input"
                type="password"
                placeholder="password"
                {...register("password")}
              />
              {errors.password && <p>{errors.password.message}</p>}
            </>
          )}
          <label htmlFor="passportNumber"></label>
          <input
            id="passportNumber"
            className="input"
            type="text"
            placeholder="PassportNumber"
            {...register("passportNumber")}
          />
          {errors.passportNumber && <p>{errors.passportNumber.message}</p>}
          <label htmlFor="phoneNumber"></label>
          <input
            id="phoneNumber"
            className="input"
            type="text"
            placeholder="PhoneNumber"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
          {role === "COURIER" && (
            <>
              {" "}
              <label htmlFor="regionId"></label>
              <select name="func" {...register(`regionId`)}>
                <option value={null}></option>
                {regions &&
                  regions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              {errors.regionId && <p>{errors.regionId.message}</p>}
            </>
          )}
          <button className="btnLogin" type="submit">
            Create Accaunt
          </button>
        </form>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "blue",
            border: "none",
            color: "white",
          }}
          onClick={() => navigate(-1)}
        >
          ◀
        </button>
      </Layout>
    </>
  );
};

export default UserMutation;
