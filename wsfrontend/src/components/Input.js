import React from "react";

const Input = (props) => {
  const { label, error, name, onChange, type, defaultValue } = props;
  let className = "form-control";
  if (type === "file") {
    className += "";
  }
  if (error !== undefined) {
    className += " is-invalid";
  }

  return (
    <div className="form-group mt-3 mb-1">
      <label>{label}</label>
      <input
        className={className}
        name={name}
        onChange={onChange}
        type={type}
        defaultValue={defaultValue}
      />
      <div className="invalid-feedback">{error}</div>
    </div>
  );
};

export default Input;
