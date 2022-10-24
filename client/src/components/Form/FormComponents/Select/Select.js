import React from "react";
import styles from "./Select.module.css";
import AttentionError from "../../../../assets/icons/AttentionError";

function Select({ data, children, onChange, error, register }) {
  return (
    <div className={styles.formControl}>
      {console.log(error)}
      <div className={styles.selectContainer}>
        <select
          className={styles.select}
          {...(register ? register() : "")}
          onChange={onChange}
          
        >
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
        {error && <AttentionError className={""} />}
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

export default Select;
