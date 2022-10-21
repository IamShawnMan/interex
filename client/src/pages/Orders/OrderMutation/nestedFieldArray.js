import React from "react";
import {useFieldArray} from "react-hook-form";
import Input from "../../../components/Form/FormComponents/Input/Input"
import Button from "../../../components/Form/FormComponents/Button/Button"
import styles from "./OrderMutation.module.css";
function OrderItems(props) {
  const { fields, append,remove } = useFieldArray({
   control: props.control,
    name: `orders.${props.orderIndex}.orderItems`
  });
  return (
    <>
    { props.errors?.orders?.[props.orderIndex]?.orderItems?.type==="min"&&<p style={{color: "red" }}>{props.errors?.orders?.[props.orderIndex].orderItems.message}</p>}
      <ul>
        {fields.map((item, index) => (
          <li className={styles.itemContainer} key={item.id}>
            <Input type="text" register={props.register.bind(null,`orders.${props.orderIndex}.orderItems.${index}.productName`)} placeholder="name" id="name" error={props.errors?.orders?.[props.orderIndex]?.orderItems?.[index]?.name?.message} />
            <Input type="number" placeholder="quantity" register={props.register.bind(null,`orders.${props.orderIndex}.orderItems.${index}.quantity`)} error={props.errors?.orders?.[props.orderIndex]?.orderItems?.[index]?.quantity?.message}/>
            <Input type="number" placeholder="price" register={props.register.bind(null,`orders.${props.orderIndex}.orderItems.${index}.price`)} error={props.errors?.orders?.[props.orderIndex]?.orderItems?.[index]?.price?.message}/>
           <div className={styles.trashBtn} onClick={() => remove(index)}>
            <Button type="button" name="iconText" iconName="trash" size="small">Delete</Button>
           </div>
            
          </li>
        ))}
      </ul>
           <div  className={styles.btnIconTextContainer}  onClick={() => append({productName:"",quantity:"",price:""})}>
            <Button type="button" name="iconText" iconName="plus" size="small">Item</Button>
           </div>
      </>
  );
}
export default OrderItems