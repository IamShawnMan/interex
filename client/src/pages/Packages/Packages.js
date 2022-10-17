import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";

function Package() {
  const [packages, setPackages] = useState([]);
  useEffect(() => {
    getAllPackages();
  }, []);

  const getAllPackages = async () => {
    try {
      const res = await http();
    } catch (error) {}
  };
  return (
    <Layout>
      <BasicTable columns={""} data={packages} />
    </Layout>
  );
}

export default Package;
