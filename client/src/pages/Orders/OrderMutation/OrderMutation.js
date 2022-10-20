import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import http from "../../../utils/axios-instance";
import { string, array, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout/Layout";
import OrderFieldArray from "./OrderFieldArray";
const schema = object().shape({
  orders: array()
    .of(
      object().shape({
        recipient: string().required("recipient kriting"),
        note: string().required("note kriting"),
        recipientPhoneNumber: string().required("phoneNumber kriting"),
        regionId: string().required("regionId kriting"),
        // districtId: string().required("districtId kriting"),
        orderItems: array()
          .of(
            object().shape({
              productName: string().required("name kriting"),
              quantity: string().required("quantity kriting"),
              price: string().required("price kriting"),
            })
          )
          .min(1, "Tovarlar royhati soni kamida 1ta bolishi kerak"),
      })
    )
    .min(1, "Buyurtmalar soni kamida 1ta bolishi kerak"),
});

function OrderMutation() {
  const [regions, setRegions] = useState(null);
  const [districts, setDistricts] = useState(null);
  const [regionId, setRegionId] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const { id } = useParams();

  const isUpdate = id !== "new";
  const navigate = useNavigate(); 
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    getAllRegions();
     if (isUpdate&&!updateData) {
      getById();
    }
   
    !isUpdate&&!regionId&&!updateData&& append({
      recipient: "",
      note: "",
      recipientPhoneNumber: "",
      regionId: "",
      districtId: "",
      orderItems: [],
    });
  }, [regionId]);
  useEffect(() =>{
 isUpdate&&updateData&&append(updateData)
  },updateData);
  const formSubmit = async (data) => {
    console.log( data.orders[0]);
    try {
      const res = await http({
        url: isUpdate ? `/orders/${id}` : "/orders",
        method: isUpdate ? "PUT" : "POST",
        data:isUpdate ? data.orders[0]:data,
      });
      console.log(res);
      toast.success(res.data.message);
      navigate("/orders");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  

  const getById = async () => {
    const res = await http({
      url: `/orders/${id}/edit`,
    });
    console.log(res);
    const orderById = res.data.data;
    console.log(orderById);
     setUpdateData(orderById);
  };
 
  const getAllRegions = async () => {
    const res = await http({
      url: "/regions",
      method: "GET",
    });
    setRegions(res.data.data.allRegions);
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "orders",
  });
  return (
    <Layout>
      <form onSubmit={handleSubmit((data) => formSubmit(data))}>
        <ul>
          {errors.orders?.type === "min" && errors.orders.message}
          {fields.map((item, index) => (
        <OrderFieldArray item={item} register={register} index={index} errors={errors} watch={watch} regions={regions} control={control}remove={remove}/>
          ))}
        </ul>
       {!isUpdate&& <button
          type="button"
          onClick={() =>
            append({
              recipient: "",
              note: "",
              recipientPhoneNumber: "",
              regionId: "",
              districtId: "",
              orderItems: [],
            })
          }
        >
          Add Order
        </button>}
      <button type="submit">{isUpdate?"Update Order":"Create Order"}</button> 
      </form>
    </Layout>
  );
}
export default OrderMutation;
