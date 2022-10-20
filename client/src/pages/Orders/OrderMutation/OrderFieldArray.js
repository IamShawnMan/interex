import { useEffect, useState } from "react";
import OrderItems from "./nestedFieldArray";
import http from "../../../utils/axios-instance";

const OrderFieldArray = ({item,register,index,errors,watch,regions,control,remove}) => {
    const [districts, setDistricts] = useState(null);
    const regionId=watch(`orders.${index}.regionId`)
    const getAllDistrict = async () => {
        const res = await http({
          url:  `regions/${regionId}/districts`,
          method: "GET",
        });
        setDistricts(res.data.data.getDistrictByRegion);
      };
      useEffect(() => {
      regionId&&  getAllDistrict();
      },[regionId])
    return (
        <li style={{ border: "1px solid black" }} key={item.id}>
        <input
          placeholder="recipient"
          {...register(`orders.${index}.recipient`)}
        />
        {errors?.orders?.[index] && (
          <>{errors?.orders?.[index]?.recipient?.message}</>
        )}
        <input placeholder="note" {...register(`orders.${index}.note`)} />
        {errors?.orders?.[index] && (
          <>{errors?.orders?.[index]?.note?.message}</>
        )}
        <input
          type="text"
          placeholder="phoneNumber"
          {...register(`orders.${index}.recipientPhoneNumber`)}
        />
        {errors?.orders?.[index] && (
          <>{errors?.orders?.[index]?.recipientPhoneNumber?.message}</>
        )}
        <select  {...register(`orders.${index}.regionId`)}
        //  onChange={e=>setRegionId(e.target.value)}
        >
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
        <button type="button" onClick={() => remove(index)}>
          Delete
        </button>
      </li>
      );
}
 
export default OrderFieldArray;