import React, { useEffect } from "react";
import styles from "./Filter.module.css";
import Select from "../Form/FormComponents/Select/Select";
import Input from "../Form/FormComponents/Input/Input";
import Button from "../Form/FormComponents/Button/Button";
import http from "../../utils/axios-instance";
import { useForm } from "react-hook-form";
function Filter() {
  const { register, watch } = useForm();
  useEffect(() => {
    getAllRegions();
    getAllStatuses();
    getAllDistricts();
    getAllStoreOwner();
  }, []);

  const getAllStatuses = async () => {
    const res = await http({
      url: "/orders/status",
    });
    console.log(res);
  };
  const getAllRegions = async () => {
    const res = await http({
      url: "/regions",
    });
    console.log(res);
  };
  const getAllDistricts = async () => {
    const res = await http({
      url: "/districts",
    });
    console.log(res);
  };

  const getAllStoreOwner = async () => {
    const res = await http({
      url: "/users?userRole=storeOwner",
    });
    console.log(res);
  };

  return (
    <form className={styles.filterContainer}>
      <Select register={register.bind(null, "status")} />
      <Select register={register.bind(null, "storeOwner")} />
      <Select register={register.bind(null, "regionId")} />
      <Select register={register.bind(null, "district")} />
      <Input type="date" register={register.bind(null, "createdAt")} />
      <Button size={"small"} type="submit" name={"btn"}>
        Apply
      </Button>
    </form>
  );
}

export default Filter;
