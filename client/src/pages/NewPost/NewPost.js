import React, { useEffect, useState } from "react";
import { BasicTable } from "../../components/Table/BasicTable";
import Button from "../../components/Form/FormComponents/Button/Button";
import Layout from "../../components/Layout/Layout";
import Input from "../../components/Form/FormComponents/Input/Input";
import { useForm } from "react-hook-form";
const data = [
  {
    id: 1,
    resipient: "Abdumalik",
    orderStatus: "DELIVERING",
    createdAt: "07/05/2022",
    resipientPhoneNumber: "+998978008878",
    district: "Karmana",
    note: "tez kelsin",
    totalPrice: 250000,
  },
  {
    id: 2,
    resipient: "Abdumalik",
    orderStatus: "DELIVERING",
    createdAt: "07/05/2022",
    resipientPhoneNumber: "+998978008878",
    district: "Karmana",
    note: "tez kelsin",
    totalPrice: 250000,
  },
  {
    id: 3,
    resipient: "Abdumalik",
    orderStatus: "DELIVERING",
    createdAt: "07/05/2022",
    resipientPhoneNumber: "+998978008878",
    district: "Karmana",
    note: "tez kelsin",
    totalPrice: 250000,
  },
  {
    id: 4,
    resipient: "Abdumalik",
    orderStatus: "DELIVERING",
    createdAt: "07/05/2022",
    resipientPhoneNumber: "+998978008878",
    district: "Karmana",
    note: "tez kelsin",
    totalPrice: 250000,
  },
];

function NewPost() {
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => {
    const data1 = data.map((e) => {
      return { ["order" + e.id]: true };
    });
    reset(data1);
  }, []);
  const cols = [
    {
      id: "id",
      Header: "Id",
      accessor: "id",
    },
    {
      id: "resipient",
      Header: "Xaridor",
      accessor: "resipient",
    },
    {
      id: "note",
      Header: "Eslatma",
      accessor: "note",
    },
    {
      id: "orderStatus",
      Header: "Holati",
      accessor: "orderStatus",
    },
    {
      id: "district",
      Header: "Tuman",
      accessor: "district",
    },
    {
      id: "resipientPhoneNumber",
      Header: "Raqami",
      accessor: "resipientPhoneNumber",
    },
    {
      id: "createdAt",
      Header: "Sanasi",
      accessor: "createdAt",
    },
    {
      id: "totalPrice",
      Header: "Umumiy narx",
      accessor: "totalPrice",
    },
    {
      id: "action",
      Header: "Action",
      accessor: (order) => {
        return (
          <>
            {order.orderStatus === "DELIVERED" && (
              <Button type="button" size="btnSmall" name="dots" />
            )}
            {order.orderStatus === "DELIVERING" && (
              <Input
                type="checkbox"
                register={register.bind(null, `order${order.id}`)}
                // value={value}
              />
            )}
          </>
        );
      },
    },
  ];

  const postHandler = (data) => {
    console.log(data);
  };

  return (
    <Layout pageName="Yangi kelgan Pochtalar">
      <form onSubmit={handleSubmit(postHandler)}>
        <BasicTable columns={cols} data={data} />
        <Button name="btn" size="small">
          Qabul qildim
        </Button>
      </form>
    </Layout>
  );
}

export default NewPost;
