import React, { useState } from "react";
import AttentionError from "../../../../assets/icons/AttentionError";
import CircleCheck from "../../../../assets/icons/CircleCheck";
import styles from "./Input.module.css";

function Input({
  type,
  register,
  placeholder,
  id,
  error,
  children,
  style,
  disabled,
  onClick,
}) {
  const [success, setSuccess] = useState(false);

  return (
    <div className={styles.formControl}>
      {children && (
        <label className={styles.label} htmlFor={id ? id : ""}>
          {children}
        </label>
      )}
      <div className={styles.inputContainer}>
        <input
          disabled={disabled}
          style={style}
          type={type ? type : "text"}
          placeholder={placeholder ? placeholder : ""}
          id={id ? id : ""}
          {...(register ? register() : "")}
          className={`${styles.input} ${error ? styles.error : ""}`}
          onClick={onClick}
        />
        {error && <AttentionError className={""} />}
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

export default Input;
