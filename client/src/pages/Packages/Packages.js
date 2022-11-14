import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";
import { Link, useSearchParams } from "react-router-dom";

import styles from "./Packages.module.css";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function Package() {
  const [packages, setPackages] = useState(null);
  const [pagination, setPagination] = useState({});
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  useEffect(() => {
    getAllPackages();
  }, [page]);

  const getAllPackages = async () => {
    try {
      const res = await http({
        url: `/packages?page=${page}&size=${size}`,
      });
      console.log(res);
      setPackages(res.data.data.content);
      setPagination(res.data.data.pagination);
    } catch (error) {}
  };

  const packageCols = [
    {
      id: "No",
      Header: "No",
      accessor: (pack, i) => {
        return `${i + 1}`;
      },
    },
    {
      id: "storeOwner",
      Header: "Paket",
      accessor: (pack) => {
        return (
          <Link to={`/packages/${pack.id}/orders`} className={styles.link}>
            {`${pack.storeOwner.storeName} `}
          </Link>
        );
      },
    },
    {
     id:"status", Header: "Holati", accessor:"packageStatus"

    },
    {
      id: "totalPrice",
      Header: "Paketlar umumiy narxi",
      accessor: (packag)=>{
        return(
          <>
          {(packag.packageTotalPrice)?.toLocaleString("Ru-Ru")}
          </>
        )
      }
    },
    {
      Header: "Sanasi",
      accessor: (order) => {
        const dateNew=new Date(order.createdAt)
        console.log(dateNew);
        return (
          <>
             {dateNew.getDate()}/
             {dateNew.getMonth()+1}/
             {dateNew.getFullYear()}
             <br/>
             {dateNew.getHours()}:{dateNew.getMinutes()}:{dateNew.getSeconds()}
          </>
        );
      },
    },
  ];

  return (
    <Layout>
      {packages?.length > 0 ? (
        <BasicTable
          columns={packageCols}
          data={packages}
          url="/packages"
          pagination={pagination}
        />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}

export default Package;
