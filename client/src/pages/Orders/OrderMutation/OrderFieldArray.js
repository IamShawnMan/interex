import { useEffect, useState } from "react";
import OrderItems from "./nestedFieldArray";
import http from "../../../utils/axios-instance";
import Input from "../../../components/Form/FormComponents/Input/Input";
import Button from "../../../components/Form/FormComponents/Button/Button";
import styles from "./OrderMutation.module.css";
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
}) => {
  const [districts, setDistricts] = useState(null);
  const regionId = watch(`orders.${index}.regionId`);
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
    <li style={{ borderBottom: "1px solid black" }} key={item.id}>
      <Input
        placeholder="recipient"
        register={register.bind(null, `orders.${index}.recipient`)}
        error={errors?.orders?.[index]?.recipient?.message}
      />
      <Input
        placeholder="note"
        register={register.bind(null, `orders.${index}.note`)}
        error={errors?.orders?.[index]?.note?.message}
      />
      <Input
        type="text"
        placeholder="phoneNumber"
        register={register.bind(null, `orders.${index}.recipientPhoneNumber`)}
        error={errors?.orders?.[index]?.recipientPhoneNumber?.message}
      />
      <Select
        register={register.bind(null, `orders.${index}.regionId`)}
        data={regions}
        error={
          errors?.orders?.[index]
            ? errors?.orders?.[index]?.regionId?.message
            : ""
        }
      ></Select>
      {regionId && (
        <Select
          register={register.bind(null, `orders.${index}.districtId`)}
          data={districts}
          error={
            errors?.orders?.[index]
              ? errors?.orders?.[index]?.districtId?.message
              : ""
          }
        ></Select>
      )}
     
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
        <Button type="button" size="small" name="iconText" iconName="trash">
          Delete
        </Button>
      </div>
    </li>
  );
};

export default OrderFieldArray;
