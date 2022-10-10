import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import http from "../../../utils/axios-instance";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  firstName:yup
    .string()
    .trim()
    .required("FirstName bo'sh bo'lishi mumkin emas"),
    phoneNumber:yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
    passportNumber:yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
    lastName:yup
    .string()
    .trim()
    .required("LastName bo'sh bo'lishi mumkin emas"),
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
const UserAddEdit = () => {
  const navigate = useNavigate();
  const [role,setRole]=useState(null)
  const [roles,setRoles]=useState(null)
  const [regions,setRegions]=useState(null)
  const [testRole,setTestRole]=useState(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(
{  resolver: yupResolver(schema),
}
  );
  const getAllUserRoles=async()=>{
    const res = await http({
    url: "/users/roles",
    method: "GET",
  });
  setRoles(res.data.data.roles);
  }
  const getAllRegions=async()=>{
    const res = await http({
    url: "/regions",
    method: "GET",
  });
  setRegions(res.data.data.allRegions);
  }
  const formSubmit=async(data)=>{
    console.log(data);
    try {
      const res = await http({
      url: "/users",
      method: "POST",
      data:{...data,userRole:role},
    });
   console.log(res);
   toast.success(res.data.message);
    navigate("/users")
  
    } catch (error) {
    toast.error(error.response.data.message);  
    }
    
  }
  useEffect(() => {
    getAllUserRoles()
    getAllRegions()
  }, []);

  return (
    <>
   { roles&&!role&&<>
    <select onChange={(e)=>setTestRole(e.target.value)}>
              <option value={null}></option>
              {roles &&
                roles.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
            <button disabled={testRole?false:true} onClick={()=>{setRole(testRole)
            console.log("adadfa");
            }}>NEXT</button>
    </>}
    {role&&<>
      <form
        onSubmit={handleSubmit((data) =>formSubmit(data))}
        className="form"
      >
        <label for="text"></label>
        <input
          id="text"
          className="input"
          type="text"
          placeholder="firstName"
          {...register("firstName")}
        />
        {errors.firstName && <p>{errors.firstName.message}</p>}
        <label for="text"></label>
        <input
          id="text"
          className="input"
          type="text"
          placeholder="lastName"
          {...register("lastName")}
        />
        {errors.lastName && <p>{errors.lastName.message}</p>}
        <label for="text"></label>
        <input
          id="text"
          className="input"
          type="text"
          placeholder="username"
          {...register("username")}
        />
        {errors.username && <p>{errors.username.message}</p>}
        <label for="password"></label>
        <input
          id="password"
          className="input"
          type="password"
          placeholder="password"
          {...register("password")}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <label for="passportNumber"></label>
        <input
          id="passportNumber"
          className="input"
          type="number"
          placeholder="PassportNumber"
          {...register("passportNumber")}
        />
        {errors.passportNumber && <p>{errors.passportNumber.message}</p>}
        <label for="phoneNumber"></label>
        <input
          id="phoneNumber"
          className="input"
          type="number"
          placeholder="PhoneNumber"
          {...register("phoneNumber")}
        />
        {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
       {role==="COURIER"&&<> <label for="regionId"></label>
        <select name="func" {...register(`regionId`)}>
              <option value={null}></option>
              {regions &&
                regions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
        {errors.regionId && <p>{errors.regionId.message}</p>}</>}
        <button className="btnLogin" type="submit">Create Accaunt</button>
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
      </button></>}</>
  );
};

export default UserAddEdit;
