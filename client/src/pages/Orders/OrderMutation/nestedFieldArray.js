import React from "react";
import { useFieldArray } from "react-hook-form";
import Input from "../../../components/Form/FormComponents/Input/Input";
import Button from "../../../components/Form/FormComponents/Button/Button";
import styles from "./nestedField.module.css";
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
            <Input
              type="text"
              register={props.register.bind(
                null,
                `orders.${props.orderIndex}.orderItems.${index}.productName`
              )}
              placeholder="Choynak"
              id="name"
              error={
                props.errors?.orders?.[props.orderIndex]?.orderItems?.[index]
                  ?.name?.message
              }
            >
              Jo'natma nomi
            </Input>
            <Input
              type="number"
              placeholder="1"
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
              Jo'natma soni
            </Input>
            <Input
              type="number"
              placeholder="1000 so'm"
              register={props.register.bind(
                null,
                `orders.${props.orderIndex}.orderItems.${index}.price`
              )}
              error={
                props.errors?.orders?.[props.orderIndex]?.orderItems?.[index]
                  ?.price?.message
              }
            >
              Jo'natma narxi
            </Input>
            <div
              onClick={() => remove(index)}
              style={{
                width: "17rem",
              }}
            >
              <label className={styles.label}>O'chirish</label>
              <Button type="button" name="iconText" iconName="trash">
                Tashlash
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div
        className={styles.btnIconTextContainer}
        onClick={() => append({ productName: "", quantity: "", price: "" })}
      >
        <Button type="button" name="iconText" iconName="plus">
          Item
        </Button>
      </div>
    </div>
  );
}
export default OrderItems;
