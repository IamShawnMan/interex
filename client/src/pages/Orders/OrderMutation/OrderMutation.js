import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import http from "../../../utils/axios-instance";
import { string, array, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout/Layout";
import OrderFieldArray from "./OrderFieldArray";
import Button from "../../../components/Form/FormComponents/Button/Button";
import styles from "./OrderMutation.module.css";

const schema = object().shape({
  orders: array()
    .of(
      object().shape({
        recipient: string().trim().required("Xaridor ismini kriting"),
        note: string().trim().required("Izoh kriting"),
        recipientPhoneNumber: string()
          .trim()
          .required("Telefon raqamini kriting"),
        regionId: string().trim().required("Viloyatni tanlag"),
        districtId: string().trim().required("Tumanni tanlang"),
        orderItems: array()
          .of(
            object().shape({
              productName: string().trim().required("Mahsulot nomini kriting"),
              quantity: string().trim().required("Mahsulot sonini kriting"),
              price: string().trim().required("Mahsulot narxini kriting"),
            })
          )
          .min(1, "Mahsulotlar kamida 1ta bolishi kerak"),
      })
    )
    .min(1, "Buyurtmalar soni kamida 1ta bolishi kerak"),
});

function OrderMutation() {
  const [regions, setRegions] = useState(null);
  const [rId, setRId] = useState(null);
  const [dId, setDId] = useState(null);
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
    if (isUpdate && !updateData) {
      getById();
    }

    !isUpdate &&
      !regionId &&
      !updateData &&
      append({
        recipient: "",
        note: "",
        recipientPhoneNumber: "+998",
        regionId: "",
        districtId: "",
        orderItems: [],
      });
  }, [regionId]);
  useEffect(() => {
    isUpdate && updateData && append({ ...updateData });
  }, [updateData]);
  const formSubmit = async (data) => {
    try {
      const res = await http({
        url: isUpdate ? `/orders/${id}` : "/orders",
        method: isUpdate ? "PUT" : "POST",
        data: isUpdate ? data.orders[0] : data,
      });
      toast.success(res.data.message);
      navigate("/orders/myorders");
    } catch (error) {
      return error.response.data.message.map((error) => toast.error(error));
    }
  };

  const getById = async () => {
    const res = await http({
      url: `/orders/${id}/edit`,
    });
    const orderById = res.data.data;
    setRId(orderById.regionId);
    setDId(orderById.districtId);
    setUpdateData(orderById);
  };

  const getAllRegions = async () => {
    const res = await http({
      url: "/regions",
      method: "GET",
    });
    setRegions(res.data.data.content);
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "orders",
  });
  return (
    <Layout>
      <form onSubmit={handleSubmit((data) => formSubmit(data))}>
        <ul style={{ overflowY: "avto", listStyle: "none" }}>
          {errors.orders?.type === "min" && (
            <p style={{ color: "red" }}>{errors.orders.message}</p>
          )}
          {fields.map((item, index) => (
            <OrderFieldArray
              key={item.id}
              rId={rId}
              item={item}
              register={register}
              index={index}
              errors={errors}
              watch={watch}
              regions={regions}
              control={control}
              remove={remove}
              dId={dId}
              reset={(obj) => reset(obj)}
            />
          ))}
        </ul>
        <div className={styles.btnBox}>
          <div className={styles.btnContainer}>
            {!isUpdate && (
              <div
                className={styles.btnIconTextContainer}
                onClick={() =>
                  append({
                    recipient: "",
                    note: "",
                    recipientPhoneNumber: "+998",
                    regionId: "",
                    districtId: "",
                    orderItems: [],
                  })
                }
              >
                <Button
                  name="iconText"
                  iconName="plus"
                  btnStyle={{ width: "13rem" }}
                  type="button"
                >
                  Buyurtma
                </Button>
              </div>
            )}
            <Button
              size="normal"
              name="iconText"
              type="submit"
              btnStyle={{ width: "13rem" }}
            >
              {isUpdate ? "Buyurtmani o'zgartirish" : "Saqlash"}
            </Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
export default OrderMutation;
