import React, { useState } from "react";
import AttentionError from "../../../../assets/icons/AttentionError";
import CircleCheck from "../../../../assets/icons/CircleCheck";
import styles from "./Input.module.css";

function Input({ type, register, plascholder, id, error, children }) {
  const [success, setSuccess] = useState(false);

  return (
    <div className={styles.formControl}>
      <label className={styles.label} htmlFor={id ? id : ""}>
        {children ? children : ""}
      </label>
      <div className={styles.inputContainer}>
        <input
          type={type ? type : "text"}
          placeholder={plascholder ? plascholder : ""}
          id={id ? id : ""}
          {...(register ? register() : "")}
          className={`${styles.input} ${error ? styles.error : ""}`}
        />
        {error && <AttentionError className={""} />}
        {/* {<CircleCheck className={""} />} */}
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

export default Input;