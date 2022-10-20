import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";
import { Link } from "react-router-dom";

import styles from "./Packages.module.css";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function Package() {
  const [packages, setPackages] = useState(null);

  useEffect(() => {
    getAllPackages();
  }, []);

  const getAllPackages = async () => {
    try {
      const res = await http({
        url: "/packages",
      });

      setPackages(res.data.data.allPackages.content);
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
      Header: "Package",
      accessor: (pack) => {
        return (
          <Link to={`/packages/${pack.id}/orders`} className={styles.link}>
            {`${pack.storeOwner.firstName} ${pack.storeOwner.lastName}`}
          </Link>
        );
      },
    },
  ];

  return (
    <Layout>
      {packages?.length > 0 ? (
        <BasicTable columns={packageCols} data={packages} />
      ) : (
        <p>Malumotlar yoq</p>
      )}
    </Layout>
  );
}

export default Package;
