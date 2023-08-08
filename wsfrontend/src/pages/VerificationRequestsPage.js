import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getVerificationRequests,
  approveVerificationRequest,
  rejectVerificationRequest,
} from "../api/apiCalls";

const VerificationRequestsPage = () => {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

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

  return (
    <div className="container">
      <h2>{t("Unverified User Applications")}</h2>
      {loading && <div className="text-center">{t("Loading...")}</div>}
      {error && <div className="text-center text-danger">{error}</div>}
      {!loading && !error && (
        <table className="table table-striped">
          <thead>{/* ... (tablo başlıkları) */}</thead>
          <tbody>
            {verificationRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.user.username}</td>
                <td>{request.user.displayName}</td>
                <td>{request.reason}</td>
                <td>
                  {request.attachment ? (
                    <a
                      href={`images/attachment/${request.attachment}`}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VerificationRequestsPage;
