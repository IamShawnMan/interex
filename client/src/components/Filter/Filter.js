import React, { useContext, useEffect, useState } from "react";
import styles from "./Filter.module.css";
import Select from "../Form/FormComponents/Select/Select";
import Input from "../Form/FormComponents/Input/Input";
import Button from "../Form/FormComponents/Button/Button";
import http from "../../utils/axios-instance";
import { useForm } from "react-hook-form";
import AppContext from "../../context/AppContext";

function Filter({ url, filterFn }) {
  const { user } = useContext(AppContext);
  const admin = user.userRole === "ADMIN";
  const superAdmin = user.userRole === "SUPER_ADMIN";
  const storeOwner = user.userRole === "STORE_OWNER";
  const { register, handleSubmit } = useForm();
  const [statuses, setStatuses] = useState(null);
  const [regions, setRegions] = useState(null);
  const [region, setRegion] = useState(null);
  const [districts, setDistricts] = useState(null);
  const [storeOwnerIds, setStoreOwner] = useState(null);
  useEffect(() => {
    getAllRegions();
    getAllStatuses();
    region && getAllDistricts();
    (admin || superAdmin) && getAllStoreOwner();
  }, []);

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

  const getAllDistricts = async () => {
    const res = await http({
      url: `/regions/${region}/districts`,
    });
    setDistricts(res.data.data.getDistrictByRegion);
  };

  const getAllStoreOwner = async () => {
    const res = await http({
      url: "/packages",
    });
  };

  const filterHandler = async (data) => {
    try {
      if (admin || superAdmin) {
        const res = await http(
          `/${url}&orderStatus=${data.status}&regionId=${data.regionId}&districtId=${data.district}`
        );
        await filterFn(res.data.data.allOrders);
      } else if (storeOwner) {
        const res = await http(
          `/${url}&orderStatus=${data.status}&regionId=${data.regionId}&districtId=${data.district}`
        );
        await filterFn(res.data.data.myOrders);
      }
    } catch (error) {
      error.response.data.data;
    }
  };

  const regionHandler = (e) => {
    setRegion(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit(filterHandler)}
      className={styles.filterContainer}
    >
      <Select register={register.bind(null, "status")} data={statuses}>
        Holati
      </Select>
      {(admin || superAdmin) && (
        <Select register={register.bind(null, "storeOwner")}>
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
      <Select register={register.bind(null, "district")} data={districts}>
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
