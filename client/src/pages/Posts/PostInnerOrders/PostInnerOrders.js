import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout/Layout";
import http from "../../../utils/axios-instance";

function PostInnerOrders() {
  const { id } = useParams();
  const navigate=useNavigate();
  useEffect(() => {
    getOrdersByPackageId();
  }, []);
  const getOrdersByPackageId = async () => {
    try {
      const res = await http({
        url: `/posts/new`,
        method: "POST",
        data:{regionId:id}
      });
      console.log(res);
        toast.success(res.data.message);
        navigate(`/posts/${res.data.data}/orders`)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout pageName="Postlar">
    <div>
    </div> </Layout>
  );
}

export default PostInnerOrders;
