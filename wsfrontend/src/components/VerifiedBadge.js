import React, { useState } from "react";
import { useTranslation } from "react-i18next";
const VerifiedBadge = ({ isAdmin }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <span
        className="d-inline-block"
        tabIndex="0"
        data-toggle="tooltip"
        data-placement="top"
        title={isAdmin ? "Admin Kullanıcısı" : "Onaylanmış Kullanıcı"}
        onClick={openModal}
        style={{ cursor: "pointer" }}
      >
        <i className={`material-icons ${isAdmin ? 'text-secondary' : 'text-info'} align-middle ms-2`}>
          {isAdmin ? 'verified' : 'verified'}
        </i>
      </span>

      {modalVisible && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <i className={`material-icons ${isAdmin ? 'text-dark' : 'text-info'} align-middle me-2 ${isAdmin ? 'shield' : 'verified'}`}>
                  {isAdmin ? 'shield' : 'verified'}
                </i>
                {isAdmin ? t("Admin Verified Account") : t("Verified Account")}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  {t("Kapat")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalVisible && (
        <div
          className="modal-backdrop show"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        ></div>
      )}
    </>
  );
};

export default VerifiedBadge;
