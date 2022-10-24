import { useEffect, useState } from "react";
import OrderItems from "./nestedFieldArray";
import http from "../../../utils/axios-instance";
import Input from "../../../components/Form/FormComponents/Input/Input"
import Button from "../../../components/Form/FormComponents/Button/Button"
import styles from "./OrderMutation.module.css";

const OrderFieldArray = ({item,register,index,errors,watch,regions,control,remove}) => {
    const [districts, setDistricts] = useState(null);
    const regionId=watch(`orders.${index}.regionId`)
    const getAllDistrict = async () => {
        const res = await http({
          url:  `/regions/${regionId}/districts`,
          method: "GET",
        });
        // console.log(res);

        setDistricts(res.data.data.getDistrictByRegion);
        // console.log(res);
      };
      useEffect(() => {
      regionId&&  getAllDistrict();
      },[regionId])
    return (
        <li style={{ borderBottom: "1px solid black" }} key={item.id}>
         {console.log(districts)}
        <Input
          placeholder="recipient"
          register={register.bind(null,`orders.${index}.recipient`)}
          error={errors?.orders?.[index]?.recipient?.message}
        />
        <Input placeholder="note" register={register.bind(null,`orders.${index}.note`)} error={errors?.orders?.[index]?.note?.message} />
        <Input
          type="text"
          placeholder="phoneNumber"
          register={register.bind(null,`orders.${index}.recipientPhoneNumber`)}
          error={errors?.orders?.[index]?.recipientPhoneNumber?.message}
        />
        <select  {...register(`orders.${index}.regionId`)}>
          <option value={null}></option>
          {regions &&
            regions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        {errors?.orders?.[index] && (
          <>{errors?.orders?.[index]?.regionId?.message}</>
        )}
      { regionId&& <select {...register(`orders.${index}.districtId`)}>
          <option value={null}></option>
          {districts &&
            districts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>}
        {errors?.orders?.[index] && (
          <>{errors?.orders?.[index]?.districtId?.message}</>
        )}
        
        <OrderItems
          orderIndex={index}
          control={control}
          errors={errors}
          register={register}
        />
         <div className={styles.btnIconTextContainer}  onClick={() => remove(index)}>
        <Button type="button" size="small" name="iconText" iconName="trash" >
          Delete
        </Button></div>
      </li>
      );
}
 
export default OrderFieldArray;