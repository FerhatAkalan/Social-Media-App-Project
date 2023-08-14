import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getVerificationRequests,
  approveVerificationRequest,
  rejectVerificationRequest,
  unVerifyUser,
} from "../api/apiCalls";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
const VerificationRequestsPage = () => {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const [selectedRequest, setSelectedRequest] = useState(null); // Seçilen başvuruyu tutmak için state
  const [showModal, setShowModal] = useState(false); // Modal'
  const showDetails = (request) => {
    setSelectedRequest(request); // Seçilen başvuruyu güncelle
    setShowModal(true); // Modal'ı göster
  };

  const hideDetails = () => {
    setShowModal(false); // Modal'ı gizle
    setSelectedRequest(null); // Seçilen başvuruyu sıfırla
  };
  useEffect(() => {
    loadVerificationRequests();
  }, []);

  const loadVerificationRequests = async () => {
    setLoading(true);
    try {
      const response = await getVerificationRequests();
      setVerificationRequests(response.data);
      setError(null);
    } catch (error) {
      setError(error.message || t("Error loading verification requests."));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    setLoading(true);
    try {
      await approveVerificationRequest(requestId);
      setError(null);
      loadVerificationRequests();
    } catch (error) {
      setError(error.message || t("Error approving verification request."));
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    setLoading(true);
    try {
      await rejectVerificationRequest(requestId);
      setError(null);
      loadVerificationRequests();
    } catch (error) {
      setError(error.message || t("Error rejecting verification request."));
    } finally {
      setLoading(false);
    }
  };

  const handleUnverify = async (userId) => {
    setLoading(true);
    try {
      await unVerifyUser(userId);
      setError(null);
      loadVerificationRequests();
    } catch (error) {
      setError(error.message || t("Error unverifying user."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-2 col-md-2">
          <Sidebar />
        </div>
        <div className="col-lg-10 col-md-10">
          <h2 className="m-2">{t("Unverified User Applications")}</h2>
          {loading && <div className="text-center">{t("Loading...")}</div>}
          {error && <div className="text-center text-danger">{error}</div>}
          {!loading && !error && (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>{t("Request ID")}</th>
                  <th>{t("User ID")}</th>
                  <th>{t("Username")}</th>
                  <th>{t("Reason")}</th>
                  <th>{t("Attachment")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {verificationRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.userId}</td>
                    <td>
                      <a
                        href={`/#/users/${request.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        {request.username}
                      </a>
                    </td>

                    <td>
                      {request.reason.length > 30
                        ? `${request.reason.slice(0, 30)}...`
                        : request.reason}
                    </td>

                    <td>
                      {request.attachment ? (
                        <a
                          href={`images/verified/${request.attachment}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("View Attachment")}
                        </a>
                      ) : (
                        t("No Attachment")
                      )}
                    </td>
                    <td>
                      {request.verified ? (
                        <span className="text-success">{t("Verified")}</span>
                      ) : (
                        <span className="text-warning">{t("Unverified")}</span>
                      )}
                    </td>
                    <td>
                      {request.verified ? (
                        <button
                          className="btn btn-warning me-2"
                          onClick={() => handleUnverify(request.userId)}
                        >
                          {t("Unverify")}
                        </button>
                      ) : (
                        <>
                          <button
                            className="btn btn-success me-2"
                            onClick={() => handleApprove(request.id)}
                          >
                            {t("Approve")}
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleReject(request.id)}
                          >
                            {t("Reject")}
                          </button>
                        </>
                      )}

                      <button
                        className="btn btn-info ms-2"
                        onClick={() => showDetails(request)}
                      >
                        {t("Details")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Modal
        visible={showModal}
        onClickCancel={hideDetails}
        message={selectedRequest && selectedRequest.reason}
        onClickOk={hideDetails}
        pendingApiCall={false}
        title={t("Application Details")}
        okButton={t("Tamam")}
      />
    </div>
  );
};

export default VerificationRequestsPage;
