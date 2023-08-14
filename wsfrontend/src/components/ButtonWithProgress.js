import React from "react";

const ButtonWithProgress = (props) => {
  const { onClick, pendingApiCall, disabled, text, className, icon } = props;
  return (
    <button
      className={className||"btn btn-success"}
      onClick={onClick}
      disabled={disabled}
      
    >
      {pendingApiCall && (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
      )}
      {icon && <i className={icon} />}
      {text}
    </button>
  );
};

export default ButtonWithProgress;
