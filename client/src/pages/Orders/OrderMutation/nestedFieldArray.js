import React from "react";
import { useFieldArray } from "react-hook-form";
import Input from "../../../components/Form/FormComponents/Input/Input";
import Button from "../../../components/Form/FormComponents/Button/Button";
import styles from "./nestedField.module.css";
import CurrencyInput from 'react-currency-input-field'

function OrderItems(props) {
  const { fields, append, remove } = useFieldArray({
    control: props.control,
    name: `orders.${props.orderIndex}.orderItems`,
  });
  return (
    <div style={{ position: "relative" }}>
      {props.errors?.orders?.[props.orderIndex]?.orderItems?.type === "min" && (
        <p style={{ color: "red" }}>
          {props.errors?.orders?.[props.orderIndex].orderItems.message}
        </p>
      )}
      <ul>
        {fields.map((item, index) => (
          <li className={styles.itemContainer} key={item.id}>
            <div className="medium h6">{index + 1}</div>
            <Input        
              type="text"
              register={props.register.bind(
                null,
                `orders.${props.orderIndex}.orderItems.${index}.productName`
              )}
              placeholder=""
              id="name"
              error={
                props.errors?.orders?.[props.orderIndex]?.orderItems?.[index]
                  ?.name?.message
              }
            >
              Buyurtma nomi
            </Input>
            <Input
              type="number"
              placeholder=""     

              register={props.register.bind(
                null,
                `orders.${props.orderIndex}.orderItems.${index}.quantity`
              )}
              defaultValue={1}
              error={
                props.errors?.orders?.[props.orderIndex]?.orderItems?.[index]
                  ?.quantity?.message
              }
            >
              Buyurtma soni
            </Input>
            <Input
              type="number"
              placeholder=""
              register={props.register.bind(
                null,
                `orders.${props.orderIndex}.orderItems.${index}.price`
              )}
              error={
                props.errors?.orders?.[props.orderIndex]?.orderItems?.[index]
                  ?.price?.message
              }
            >
              Buyurtma narxi
            </Input>
            {/* <CurrencyInput
            {...props.register(`orders.${props.orderIndex}.orderItems.${index}.price`)}
  id="input-example"
  name="input-name"
  placeholder="Buyurtma narxi"
  onValueChange={(value, name) => console.log(value, name)}
/> */}
           <Button
              size="normal"
              name="iconText"
              type="submit"
              btnStyle={{ width: "13rem" }}
            >
              {props.isUpdate ? "Buyurtmani o'zgartirish" : "Saqlash"}
            </Button>
          </li>
        ))}
      </ul>
      {/* <div
        className={styles.btnIconTextContainer}
        onClick={() => append({ productName: "", quantity: "", price: "" })}
      >
        <Button type="button" btnStyle={{backgroundColor:"green"}} name="icon" iconName="plus">
          Mahsulot
        </Button>
      </div> */}
    </div>
  );
}
export default OrderItems;
