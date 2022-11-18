import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../components/Form/FormComponents/Button/Button";
// import styles from "./Packages.module.css";
function PackageBack() {
  const [packages, setPackages] = useState(null);
  const [sNew, setSNew] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  useEffect(() => {
    getAllPackages();
  }, [page, sNew]);

  const getAllPackages = async () => {
    try {
      const res = await http({
        url: `/packageback?page=${page}&size=${size}`
      });
      console.log(res);
      setPackages(res.data.data);
      // setPackages(res.data.data.content);
      setPagination(res.data.data.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  const packageCols = [
    {
      id: "id",
      Header: "id",
      accessor: "id",
    },
    {
      id: "storeOwner",
      Header: "Paket",
      accessor: "storeOwner.storeName",
    },
    {
      id: "status",
      Header: "Holati",
      accessor: "packageStatus",
    },
    {
      id: "totalPrice",
      Header: "Paketlar umumiy narxi",
      accessor: (packag) => {
        return <>{packag.packageTotalPrice?.toLocaleString("Ru-Ru")}</>;
      },
    },
    {
      Header: "Sanasi",
      accessor: (order) => {
        const dateNew = new Date(order.createdAt);
        return (
          <>
            {dateNew.getDate()}/{dateNew.getMonth() + 1}/{dateNew.getFullYear()}
            <br />
            {dateNew.getHours()}:{dateNew.getMinutes()}:{dateNew.getSeconds()}
          </>
        );
      },
    },
    {
      Header: "Tugmalar",
      accessor: (pack) => {
        return (
          <Link to={`/packageback/${pack.id}/orders`} >
            <Button name="btn"> Ochish</Button>
          </Link>
        );
      },
    },
  ];

  return (
    <Layout>
      <div style={{ display: "flex", gap: "1rem", width: "22rem" }}>
        <Button name="btn" onClick={() => setSNew(true)}>
          Yangi
        </Button>
        <Button name="btn" onClick={() => setSNew(false)}>
          Barchasi
        </Button>
      </div>
      {packages?.length > 0 ? (
        <BasicTable
          columns={packageCols}
          data={packages}
          url="/packageback"
          pagination={pagination}
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}

export default PackageBack;
