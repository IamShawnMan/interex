import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import http from "../../../utils/axios-instance";
import { string, array, object } from "yup";
import OrderItems from "./nestedFieldArray";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout/Layout";
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
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  useEffect(() => {
    getAllRegions();
    if (isUpdate) {
      (async()=>{
       await getById();
       regionId&&getAllDistrict(regionId);
      updateData&&append({...updateData,orderItems: updateData.item})
      })()
      
    }
    regionId&&!isUpdate&&getAllDistrict(regionId);
   
 
   !isUpdate&&!regionId&& append({
      recipient: "",
      note: "",
      recipientPhoneNumber: "",
      regionId: "",
      districtId: "",
      orderItems: [],
    });
  }, [regionId]);
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
      url: `/orders/${id}`,
    });
    console.log(res);
    const orderById = res.data.data.orderById;
    setRegionId(orderById.regionId)
     setUpdateData(orderById);
  };
 
  const getAllRegions = async () => {
    const res = await http({
      url: "/regions",
      method: "GET",
    });
    setRegions(res.data.data.allRegions);
  };
  const getAllDistrict = async (id) => {
    const res = await http({
      url:  `regions/${id}/districts`,
      method: "GET",
    });
    console.log(res);
    setDistricts(res.data.data.getDistrictByRegion);
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
            <li style={{ border: "1px solid black" }} key={item.id}>
              <input
                placeholder="recipient"
                {...register(`orders.${index}.recipient`)}
              />
              {errors?.orders?.[index] && (
                <>{errors?.orders?.[index]?.recipient?.message}</>
              )}
              <input placeholder="note" {...register(`orders.${index}.note`)} />
              {errors?.orders?.[index] && (
                <>{errors?.orders?.[index]?.note?.message}</>
              )}
              <input
                type="text"
                placeholder="phoneNumber"
                {...register(`orders.${index}.recipientPhoneNumber`)}
              />
              {errors?.orders?.[index] && (
                <>{errors?.orders?.[index]?.recipientPhoneNumber?.message}</>
              )}
              <select  {...register(`orders.${index}.regionId`)}
               onChange={e=>setRegionId(e.target.value)}
              >
                <option value={null}></option>
                {regions &&
                  regions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              {errors?.orders?.[index] && (
                <>{errors?.orders?.[index]?.regionId?.message}</>
              )}
            { regionId&& <select {...register(`orders.${index}.districtId`)}>
                <option value={null}></option>
                {districts &&
                  districts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>}
              {errors?.orders?.[index] && (
                <>{errors?.orders?.[index]?.districtId?.message}</>
              )}
              <OrderItems
                orderIndex={index}
                control={control}
                errors={errors}
                register={register}
              />
              <button type="button" onClick={() => remove(index)}>
                Delete
              </button>
            </li>
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
