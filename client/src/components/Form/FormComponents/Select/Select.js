import React from "react";
import styles from "./Select.module.css";
import Arrow from "../../../../assets/icons/Arrow";

function Select({ data, children }) {
  return (
    <>
      <select className={styles.select}>
        <option className={styles.option} value={null}>
          {children}
        </option>
        {data ? (
          data.map((e) => (
            <option className={styles.option} key={e.id} value={e.id}>
              {e.name}
            </option>
          ))
        ) : (
          <option className={styles.option} value={null}>
            Ma'lumotlar yo'q
          </option>
        )}
      </select>
    </>
  );
}

export default Select;
