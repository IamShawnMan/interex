import React, { useEffect } from "react";
import styles from "./Filter.module.css";
import Select from "../Form/FormComponents/Select/Select";
import { useForm } from "react-hook-form";
function Filter() {
  const { register, watch } = useForm();
  useEffect(() => {}, []);

  return (
    <form className={styles.filterContainer}>
      <Select register={register.bind(null, "status")} />
      <Select register={register.bind(null, "storeOwner")} />
      <Select register={register.bind(null, "regionId")} />
      <Select register={register.bind(null, "createdAt")} />
    </form>
  );
}

export default Filter;
