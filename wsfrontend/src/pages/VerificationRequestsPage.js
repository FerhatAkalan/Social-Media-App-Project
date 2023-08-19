import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getVerificationRequests,
  approveVerificationRequest,
  rejectVerificationRequest,
  unVerifyUser,
} from "../api/apiCalls";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import { getProtectedImage } from "../api/apiCalls";

const VerificationRequestsPage = () => {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    // İlk yükleme ve belirli aralıklarla verileri yenile
    const interval = setInterval(() => {
      loadVerificationRequests();
    }, 10000); // 10 saniyede bir güncelleme yap
    return () => clearInterval(interval); // Komponent ayrıldığında interval'i temizle
  }, []);

  function arrayBufferToBase64(arrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  const showDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const hideDetails = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const showFile = (fileUrl, request) => {
    setSelectedRequest(request);
    setSelectedFile(fileUrl);
    handleFileClick(fileUrl);
  };

  const hideFileModal = () => {
    setFileData(null);
    setSelectedFile(null);
    setShowFileModal(false);
  };

  const handleFileClick = async (fileUrl) => {
    try {
      const response = await getProtectedImage(fileUrl);
      setFileData(response.data);
      setShowFileModal(true);
    } catch (error) {
      console.error("Dosya alınırken hata oluştu:", error);
    }
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
          <h4 className="m-2 text-center">
            {t("Unverified User Applications")}
          </h4>
          {loading && <div className="text-center">{t("Loading...")}</div>}
          {error && <div className="text-center text-danger">{error}</div>}
          {!loading && !error && (
            <table className="table table-striped table-bordered table-hover">
              <caption>{t("Unverified User Applications")}</caption>
              <thead>
                <tr className="table-primary">
                  <th>{t("Request ID")}</th>
                  {/* <th>{t("User ID")}</th> */}
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
                    {/* <td>{request.userId}</td> */}
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
                      {request.verified ? (
                        <span className="text-success btn-status">
                          <b>{t("Verified")}</b>
                        </span>
                      ) : (
                        <span className="text-warning btn-status">
                          <b>{t("Unverified")}</b>
                        </span>
                      )}
                    </td>
                    <td>
                      {request.attachment ? (
                        <button
                          className="btn btn-view"
                          onClick={() =>
                            showFile(`${request.attachment}`, request)
                          }
                        >
                          {t("View Attachment")}
                        </button>
                      ) : (
                        <button className="btn btn-view">
                          {t("No Attachment")}
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-info mx-2"
                        onClick={() => showDetails(request)}
                      >
                        {t("Details")}
                      </button>
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
        okButton={t("OK")}
      />
      {/* Dosya Modalı */}
      <Modal
        visible={showFileModal}
        showCloseButton={true}
        cancelButtonText={t("OK")}
        onClickCancel={hideFileModal}
        onClickOk={hideFileModal}
        pendingApiCall={false}
        title={
          selectedFile && selectedRequest
            ? `${t("View Attachment")}: ${selectedRequest.username}`
            : ""
        }
      >
        {fileData && (
          <iframe
            src={`data:application/pdf;base64,${arrayBufferToBase64(fileData)}`}
            title="PDF Görüntüleyici"
            style={{ width: "100%", height: "72vh" }}
          />
        )}
      </Modal>
    </div>
  );
};

export default VerificationRequestsPage;
