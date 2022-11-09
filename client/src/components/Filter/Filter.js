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
  const isAdmin = user.userRole === "ADMIN";
  const isSuperAdmin = user.userRole === "SUPER_ADMIN";
  const { register, handleSubmit } = useForm();
  const [statuses, setStatuses] = useState(null);
  const [regions, setRegions] = useState(null);
  const [region, setRegion] = useState(null);
  const [districts, setDistricts] = useState(null);
  const [storeOwnerIds, setStoreOwner] = useState(null);
  const [allQueries, setAllQueries] = useState(null);
  useEffect(() => {
    filterFn(allQueries);
    getAllRegions();
    getAllStatuses();
    region && getAllDistricts(region);
    (isAdmin || isSuperAdmin) && getAllStoreOwner();
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
    setRegions(res.data.data.content);
  };

  const getAllDistricts = async (id) => {
    const res =
      id &&
      (await http({
        url: `/regions/${id}/districts`,
      }));
    id && setDistricts(res.data.data.getDistrictByRegion);
  };
  const getAllStoreOwner = async () => {
    const res = await http({
      url: "/users?userRole=STORE_OWNER",
    });

    setStoreOwner(
      res.data.data.content.map((s) => {
        return { id: s.id, name: s.storeName };
      })
    );
  };
  const filterHandler = async (data) => {
    setAllQueries(data);
    filterFn(data);
  };

  const regionHandler = (e) => {
    setRegion(e.target.value);
    getAllDistricts(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit(filterHandler)}
      className={styles.filterContainer}
    >
      <Select
        register={register.bind(null, "status")}
        data={statuses}
        placeholder="Barchasi"
        id="status"
      >
        Holati
      </Select>
      {(isAdmin || isSuperAdmin) && (
        <Select
          register={register.bind(null, "storeOwnerId")}
          data={storeOwnerIds}
          placeholder="Barcha Do'konlar"
          id="storeName"
        >
          Magazin nomi
        </Select>
      )}
      <Select
        register={register.bind(null, "regionId")}
        data={regions}
        onChange={regionHandler}
        placeholder="Barcha viloyatlar"
        id="viloyatlar"
      >
        Viloyatlar
      </Select>
      <Select
        register={register.bind(null, "districtId")}
        data={districts}
        placeholder="Barcha tumanlar"
        id="tumanlar"
      >
        Tumanlar
      </Select>
      <Input type="date" register={register.bind(null, "createdAt")}>
        Sanasi
      </Input>
      <Button
        size={"small"}
        type="submit"
        name={"btn"}
        btnStyle={{ padding: "1rem 1rem", marginTop: "2.2rem" }}
      >
        Saralash
      </Button>
    </form>
  );
}

export default Filter;
