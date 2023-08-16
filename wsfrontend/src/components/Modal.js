import React from 'react';
import { useTranslation } from 'react-i18next';
import ButtonWithProgress from '../components/ButtonWithProgress';

const Modal = (props) => {
  const { visible, onClickCancel, message, onClickOk, pendingApiCall, title, okButton, cancelButtonText,showCloseButton } = props;
  const { t } = useTranslation();

  let className = 'modal fade';
  if (visible) {
    className += ' show d-block';
  }

  return (
    <div className={className} style={{ backgroundColor: '#000000b0' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title">{title}</h6>
            {showCloseButton && (
              <button type="button" className="btn-close" aria-label="Close" onClick={onClickCancel}></button>
            )}
          </div>
          <div className="modal-body text-start embed-responsive embed-responsive-16by9">
            {message}
            {props.children}
          </div>
          <div className="modal-footer">
            {cancelButtonText && (
              <button className="btn btn-secondary" disabled={pendingApiCall} onClick={onClickCancel}>
                {cancelButtonText}
              </button>
            )}
            {okButton && (
              <ButtonWithProgress
                className="btn btn-danger"
                onClick={onClickOk}
                pendingApiCall={pendingApiCall}
                disabled={pendingApiCall}
                text={okButton}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
