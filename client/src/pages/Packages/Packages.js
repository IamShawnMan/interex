import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";
import { toast } from "react-toastify";

function Package() {
  const [packages, setPackages] = useState([]);
  useEffect(() => {
    getAllPackages();
  }, []);

  const getAllPackages = async () => {
    try {
      const res = await http({
        url: `packages`
      });
      setPackages(res.data.data.allPackage.content);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response.data);
    }
  };
  const packageCols = [
    { Header: "id", accessor: "id" },
    { Header: "Note", accessor: "note" },
    { Header: "packageTotalPrice", accessor: "packageTotalPrice" },
    { Header: "storeOwnerId", accessor: "storeOwnerId" },
    { Header: "createdAt", accessor: "createdAt" },
  ];
  return (
    <Layout>
      <BasicTable columns={packageCols} data={packages} />
    </Layout>
  );
}

export default Package;
