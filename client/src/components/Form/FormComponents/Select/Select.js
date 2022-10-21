import React from "react";
import Option from "./Options/Option";
import styles from "./Select.module.css";
import Arrow from "../../../../assets/icons/Arrow";

function Select({ value, children }) {
  return (
    <select className={styles.select}>
      <option value={null}>{children}</option>
      {value ? (
        value.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))
      ) : (
        <option value={null}>Ma'lumotlar yo'q</option>
      )}
    </select>
  );
}

export default Select;
