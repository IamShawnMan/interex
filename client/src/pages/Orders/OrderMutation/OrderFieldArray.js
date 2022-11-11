import { useEffect, useState } from "react";
import OrderItems from "./nestedFieldArray";
import http from "../../../utils/axios-instance";
import Input from "../../../components/Form/FormComponents/Input/Input";
import Button from "../../../components/Form/FormComponents/Button/Button";
import styles from "./OrderField.module.css";
import Select from "../../../components/Form/FormComponents/Select/Select";

const OrderFieldArray = ({
  item,
  register,
  index,
  errors,
  watch,
  regions,
  control,
  remove,
  rId,
  dId
}) => {
  const [districts, setDistricts] = useState(null);
  const [regionId, setRegionId] = useState(rId);
  const [districtId, setDistrictId] = useState(dId);
  // let districtId = watch(`orders.${index}.districtId`);
  const getAllDistrict = async () => {
    const res = await http({
      url: `regions/${regionId}/districts`,
      method: "GET",
    });
    setDistricts(res.data.data.getDistrictByRegion);
  };
  useEffect(() => {
    regionId && getAllDistrict(); 
  }, [regionId]);

  return (
    <li
      style={{ borderBottom: "1px solid black", position: "relative" }}
      key={item.id}
    >
      <div className={styles.orderContainer}>
        <Input
          placeholder="Anvar"
          register={register.bind(null, `orders.${index}.recipient`)}
          error={errors?.orders?.[index]?.recipient?.message}
        >
          Haridor
        </Input>
        <Input
          placeholder="Mo'ljal/Vaqt"
          register={register.bind(null, `orders.${index}.note`)}
          error={errors?.orders?.[index]?.note?.message}
        >
          Eslatma
        </Input>
        <Input
          type="text"
          placeholder="+998991234567"
          register={register.bind(null, `orders.${index}.recipientPhoneNumber`)}
          error={errors?.orders?.[index]?.recipientPhoneNumber?.message}
        >
          Telefon
        </Input>
        <Select
          register={register.bind(null, `orders.${index}.regionId`)}
          data={regions}
          error={
            errors?.orders?.[index]
              ? errors?.orders?.[index]?.regionId?.message
              : ""
          }
          placeholder="Barcha viloyat"
          onChange={(e) => {
            setRegionId(e.target.value);
          }}
        >
          Viloyat
        </Select>

        <Select
          register={register.bind(null, `orders.${index}.districtId`)}
          data={districts}
          placeholder="Barcha tuman"
          error={
            errors?.orders?.[index]
              ? errors?.orders?.[index]?.districtId?.message
              : ""
          }
          onChange={(e) => {
            setDistrictId(e.target.value);
          }}
        >
         Tumanlar
        </Select>
      </div>

      <OrderItems
        orderIndex={index}
        control={control}
        errors={errors}
        register={register}
      />
      <div
        className={styles.btnIconTextContainer}
        onClick={() => remove(index)}
      >
        <Button type="button" name="iconText" iconName="trash">
          Tashlash
        </Button>
      </div>
    </li>
  );
};

export default OrderFieldArray;
