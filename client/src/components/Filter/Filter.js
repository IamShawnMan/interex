import React, { useContext, useEffect, useState } from "react";
import styles from "./Filter.module.css";
import Select from "../Form/FormComponents/Select/Select";
import Input from "../Form/FormComponents/Input/Input";
import Button from "../Form/FormComponents/Button/Button";
import http from "../../utils/axios-instance";
import { useForm } from "react-hook-form";
import AppContext from "../../context/AppContext";
import { useSearchParams } from "react-router-dom";

function Filter({ url, filterFn }) {
  const { user } = useContext(AppContext);
  const isAdmin = user.userRole === "ADMIN";
  const isSuperAdmin = user.userRole === "SUPER_ADMIN";
  const isStoreOwner = user.userRole === "STORE_OWNER";
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 2;
  const { register, handleSubmit } = useForm();
  const [statuses, setStatuses] = useState(null);
  const [regions, setRegions] = useState(null);
  const [region, setRegion] = useState(null);
  const [districts, setDistricts] = useState(null);
  const [allQueries, setQueries] = useState(null);
  const [storeOwnerIds, setStoreOwner] = useState(null);
  useEffect(() => {
    getAllRegions();
    getAllStatuses();
    region && getAllDistricts();
    (isAdmin || isSuperAdmin) && getAllStoreOwner();
    getAllOrders(allQueries);
  }, [page]);

  const getAllStatuses = async () => {
    const res = await http({
      url: "/orders/status",
    });
    setStatuses(
      res.data.data.allOrderStatus.map((e) => {
        return { id: e, name: e };
      })
    );
  };
  const getAllRegions = async () => {
    const res = await http({
      url: "/regions",
    });
    setRegions(res.data.data.allRegions.content);
  };

  const getAllDistricts = async (id) => {
    const res = await http({
      url: `/regions/${id}/districts`,
    });
    setDistricts(res.data.data.getDistrictByRegion);
  };

  const getAllStoreOwner = async () => {
    const res = await http({
      url: "/users?userRole=STORE_OWNER",
    });

    setStoreOwner(
      res.data.data.allUsers.content.map((s) => {
        return { id: s.id, name: s.storeName };
      })
    );
  };

  const getAllOrders = async (data) => {
    try {
      if (isAdmin || isSuperAdmin) {
        const res = await http(
          `/${url}?page=${page}&size=${size}${
            data.status ? `&orderStatus=${data.status}` : ""
          }${data.regionId ? `&regionId=${data.regionId}` : ""}${
            data.districtId ? `&districtId=${data.districtId}` : ""
          }${data.storeOwnerId ? `&storeOwnerId=${data.storeOwnerId}` : ""}${
            data.createdAt ? `&createdAt=${data.createdAt}` : ""
          }`
        );
        filterFn(res.data.data);
      } else if (isStoreOwner) {
        const res = await http(
          `/${url}?page=${page}&size=${size}${
            data.status ? `&orderStatus=${data.status}` : ""
          }${data.regionId ? `&regionId=${data.regionId}` : ""}${
            data.districtId ? `&districtId=${data.districtId}` : ""
          }&${data.createdAt ? `&createdAt=${data.createdAt}` : ""}`
        );
        console.log(res.data.data);
        filterFn(res.data.data);
      }
    } catch (error) {}
  };

  const filterHandler = async (data) => {
    getAllOrders(data);
    setQueries(data);
  };

  const regionHandler = (e) => {
    getAllDistricts(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit(filterHandler)}
      className={styles.filterContainer}
    >
      <Select register={register.bind(null, "status")} data={statuses}>
        Holati
      </Select>
      {(isAdmin || isSuperAdmin) && (
        <Select
          register={register.bind(null, "storeOwnerId")}
          data={storeOwnerIds}
        >
          Magazin nomi
        </Select>
      )}
      <Select
        register={register.bind(null, "regionId")}
        data={regions}
        onChange={regionHandler}
      >
        Viloyatlar
      </Select>
      <Select register={register.bind(null, "districtId")} data={districts}>
        Tumanlar
      </Select>
      <Input type="date" register={register.bind(null, "createdAt")} />
      <Button size={"small"} type="submit" name={"btn"}>
        Apply
      </Button>
    </form>
  );
}

export default Filter;
