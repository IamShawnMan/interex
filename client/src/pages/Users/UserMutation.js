import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import http from "../../utils/axios-instance";
import { toast } from "react-toastify";
import Layout from "../../components/Layout/Layout";
import Input from "../../components/Form/FormComponents/Input/Input";
import Button from "../../components/Form/FormComponents/Button/Button";
import Select from "../../components/Form/FormComponents/Select/Select";

const registerSchema = yup.object().shape({
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
  userRole: yup
    .string()
    .trim()
    .required("Foydalanuvchi mansabi bo'sh bo'lishi mumkin emas!")
    .min(
      5,
      "Foydalanavchi mansabi eng kamida 5 ta belgidan iborat bo'lishi kerak!"
    )
    .max(20, "Foydalanuvchi mansabi 20 ta belgidan ko'p bo'lmasligi kerak!"),
});
const userRoleCOURIER = yup.object().shape({
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
    regionId:yup.string().trim().required("Region bo'sh bo'lishi mumkin emas"),
  userRole: yup
    .string()
    .trim()
    .required("Foydalanuvchi mansabi bo'sh bo'lishi mumkin emas!")
    .min(
      5,
      "Foydalanavchi mansabi eng kamida 5 ta belgidan iborat bo'lishi kerak!"
    )
    .max(20, "Foydalanuvchi mansabi 20 ta belgidan ko'p bo'lmasligi kerak!"),
});

const updateSchema = yup.object().shape({
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
  userRole: yup
    .string()
    .trim()
    .required("Foydalanuvchi mansabi bo'sh bo'lishi mumkin emas!")
    .min(
      5,
      "Foydalanavchi mansabi eng kamida 5 ta belgidan iborat bo'lishi kerak!"
    )
    .max(20, "Foydalanuvchi mansabi 20 ta belgidan ko'p bo'lmasligi kerak!"),
});

const UserMutation = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [roles, setRoles] = useState(null);
  const [regions, setRegions] = useState(null);
  const { id } = useParams();
  const isUpdate = id !== "new";
  let scheme=isUpdate?updateSchema: registerSchema
  const userRoles = roles
    ? roles.map((e) => {
        return { id: e, name: e };
      })
    : [];
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(role==="COURIER"?userRoleCOURIER:scheme),
  });

  useEffect(() => {
    getAllUserRoles();
    getAllRegions();
    if (isUpdate) {
      getById();
    }
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
    const user = res.data.data.userById;
    if (user.userRole === "COURIER") {
      setRole("COURIER");
    }
    reset(user);
  };
  const formSubmit = async (data) => {
    console.log(data);
    try {
      const res = await http({
        url: isUpdate ? `/users/${id}` : "/users",
        method: isUpdate ? "PUT" : "POST",
        data,
      });
      console.log(res)
      toast.success(res.data.message);
      navigate("/users");
    } catch (error) {
      console.log(error.response.data.message);
      return error.response.data.message.map((error) => toast.error(error));
    }
  };
  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit(formSubmit)} className="form">
          <Select
            register={register.bind(null, "userRole")}
            data={userRoles}
            onChange={(e) => setRole(e.target.value)}
            error={errors.userRole?.message}
          >
            Foydalanuvchi mansabi
          </Select>

          <Input
            id="text"
            type="text"
            placeholder="firstName"
            register={register.bind(null, "firstName")}
            error={errors.firstName?.message}
          />

          <Input
            id="text"
            type="text"
            placeholder="lastName"
            register={register.bind(null, "lastName")}
            error={errors.lastName?.message}
          />

          <Input
            id="text"
            type="text"
            placeholder="username"
            register={register.bind(null, "username")}
            error={errors.username?.message}
          />
          {!isUpdate && (
            <>
              <label htmlFor="password"></label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                register={register.bind(null, "password")}
                error={errors.password?.message}
              />
            </>
          )}

          <Input
            id="passportNumber"
            type="text"
            placeholder="PassportNumber"
            register={register.bind(null, "passportNumber")}
            error={errors.passportNumber?.message}
          />

          <Input
            id="phoneNumber"
            type="text"
            placeholder="PhoneNumber"
            register={register.bind(null, "phoneNumber")}
            error={errors.phoneNumber?.message}
          />

          {role === "COURIER" && (
            <Select
              register={register.bind(null, "regionId")}
              data={regions.content}
              error={errors.regionId?.message}
            >
              Viloyatlar
            </Select>
          )}

          <Button type="submit" size="small" name="btn" className="btnLogin">
            {!isUpdate ? "Create Accaunt" : "Update User"}
          </Button>
        </form>
      </Layout>
    </>
  );
};

export default UserMutation;
