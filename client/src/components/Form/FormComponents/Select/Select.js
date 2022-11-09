import React from "react";
import styles from "./Select.module.css";
import AttentionError from "../../../../assets/icons/AttentionError";

function Select({
  data,
  children,
  onChange,
  error,
  register,
  id,
  placeholder,
}) {
  return (
    <div className={styles.formControl}>
      <div className={styles.selectContainer}>
        <div className={styles.selectControl}>
          {children && (
            <label className={styles.label} htmlFor={id ? id : ""}>
              {children}
            </label>
          )}
          <select
            className={styles.select}
            {...(register ? register() : "")}
            onChange={onChange}
          >
            <option className={styles.option} value={""}>
              {placeholder}
            </option>
            {data ? (
              data.map((e) => (
                <option className={styles.option} key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))
            ) : (
              <option className={styles.option} value={""}>
                Ma'lumotlar yo'q
              </option>
            )}
          </select>
        </div>
        {error && <AttentionError className={""} />}
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

export default Select;
