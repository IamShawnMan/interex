import React from "react";
import {useFieldArray} from "react-hook-form";
function OrderItems(props) {
  const { fields, append,remove } = useFieldArray({
   control: props.control,
    name: `orders.${props.orderIndex}.orderItems`
  });
  return (
    <>
    { props.errors?.orders?.[props.orderIndex]?.orderItems?.type==="min"&&props.errors?.orders?.[props.orderIndex].orderItems.message}
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            <input placeholder="name" {...props.register(`orders.${props.orderIndex}.orderItems.${index}.productName`)} />
            {props.errors?.orders?.[index]&&<>{props.errors?.orders?.[props.orderIndex]?.orderItems?.[index]?.name?.message}</>}
            <input type="number" placeholder="quantity" {...props.register(`orders.${props.orderIndex}.orderItems.${index}.quantity`)} />
            {props.errors?.orders?.[index]&&<>{props.errors?.orders?.[props.orderIndex]?.orderItems?.[index]?.quantity?.message}</>}
            <input type="number" placeholder="price" {...props.register(`orders.${props.orderIndex}.orderItems.${index}.price`)} />
            {props.errors?.orders?.[index]&&<>{props.errors?.orders?.[props.orderIndex]?.orderItems?.[index]?.price?.message}</>}
            <button type="button" onClick={() => remove(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => append({productName:"",quantity:"",price:""})}
      >
        Add Item
      </button>
      </>
  );
}
export default OrderItems