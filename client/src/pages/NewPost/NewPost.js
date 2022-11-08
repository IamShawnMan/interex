import React, { useEffect, useState } from "react";
import { BasicTable } from "../../components/Table/BasicTable";
import Button from "../../components/Form/FormComponents/Button/Button";
import Layout from "../../components/Layout/Layout";
import Input from "../../components/Form/FormComponents/Input/Input";
import http from "../../utils/axios-instance";
import { useForm } from "react-hook-form";
import { formatDate } from "../../utils/dateFormatter";

function NewPost() {
  const [ordersIdArr, setOrdersIdArr] = useState([]);
  const [postData, setPostData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    getNewPost();
  }, []);

  const getNewPost = async () => {
    const res = await http("/posts/new/coming");
    console.log(res);
    setOrdersIdArr(res?.data?.data?.orderArr);
    setOrderData(res?.data?.data?.ordersOnTheWay?.content);
    setPostData([res?.data?.data?.postOnTheWay]);
  };

  const postCols = [
    {
      id: "status",
      Header: "Post holati",
      accessor: "postStatus",
    },
    {
      id: "note",
      Header: "Eslatma",
      accessor: "note",
    },
    {
      id: "date",
      Header: "kun-oy-yil",
      accessor: (post) => {
        const date = formatDate(post.createdAt);
        return (
          <>
            {date.slice(0, 10)}
            <br />
            {date.slice(10)}
          </>
        );
      },
    },
    {
      id: "postTotalPrice",
      Header: "Post umumiy narxi",
      accessor: "postTotalPrice",
    },
  ];

  const orderCols = [
    {
      id: "id",
      Header: "ID",
      accessor: "id",
    },
    {
      id: "recipient",
      Header: "Xaridor",
      accessor: "recipient",
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
      accessor: "district.name",
    },
    {
      id: "recipientPhoneNumber",
      Header: "Raqami",
      accessor: "recipientPhoneNumber",
    },
    {
      id: "createdAt",
      Header: "kun-oy-yil",
      accessor: (order) => {
        const date = formatDate(order.createdAt);
        return (
          <>
            {date.slice(0, 10)}
            <br />
            {date.slice(10)}
          </>
        );
      },
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
                checked={ordersIdArr.includes(order.id)}
                onClick={() => {
                  const index = ordersIdArr.includes(order.id);
                  if (index) {
                    let orderIsArr = ordersIdArr.filter((i) => i !== order.id);
                    setOrdersIdArr(orderIsArr);
                  } else {
                    setOrdersIdArr((prev) => [...prev, order.id]);
                  }
                }}
              />
            )}
          </>
        );
      },
    },
  ];

  const postHandler = async () => {
    const res = await http({
      url: "/posts/new/recieve",
      data: {
        postStatus: "DELIVERED",
        ordersArr: ordersIdArr,
        postId: postData?.[0]?.id,
      },
      method: "PUT",
    });
    console.log(res?.data);
  };

  return (
    <Layout pageName="Yangi kelgan Pochtalar">
      {orderData.length > 0 ? (
        <>
          {postData && <BasicTable columns={postCols} data={postData} />}
          <br />
          <hr />
          <BasicTable columns={orderCols} data={orderData} />
        </>
      ) : (
        <p style={{ textAligin: "center" }}>Ma'lumotlar topilmadi</p>
      )}
      <Button onClick={postHandler} name="btn" size="small" type="button">
        Qabul qildim
      </Button>
    </Layout>
  );
}

export default NewPost;
