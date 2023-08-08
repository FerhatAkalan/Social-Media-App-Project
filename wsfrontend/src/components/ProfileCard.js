import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { useTranslation } from "react-i18next";
import Input from "../components/Input";
import {
  updateUser,
  deleteUser,
  getVerificationRequests,
} from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import ButtonWithProgress from "../pages/ButtonWithProgress";
import { updateSuccess, logoutSucces } from "../redux/authActions";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import VerificationRequestsPage from "../pages/VerificationRequestsPage";

const ProfileCard = (props) => {
  const [inEditMode, setInEditMode] = useState(false);
  const [updatedDisplayName, setUpdatedDisplayName] = useState();
  const { username: loggedInUsername } = useSelector((store) => ({
    username: store.username,
  }));
  const routeParams = useParams();
  const pathUsername = routeParams.username;
  const [user, setUser] = useState({});
  const [editable, setEditable] = useState(false);
  const [verifiedRequest, setVerifiedRequest] = useState(false);

  const [newImage, setNewImage] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { username, displayName, image, admin } = user;
  const isAdmin = useSelector((store) => store.admin);

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  useEffect(() => {
    setEditable(pathUsername === loggedInUsername || isAdmin);
  }, [pathUsername, loggedInUsername]);

  useEffect(() => {
    setValidationErrors((previousValidationErrors) => ({
      ...previousValidationErrors,
      displayName: undefined,
    }));
  }, [updatedDisplayName]);

  useEffect(() => {
    setValidationErrors((previousValidationErrors) => ({
      ...previousValidationErrors,
      image: undefined,
    }));
  }, [newImage]);

  const pendingApiCallDeleteUser = useApiProgress(
    "delete",
    `/api/1.0/users/${username}`,
    true
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (!inEditMode) {
      setUpdatedDisplayName(undefined);
      setNewImage(undefined);
    } else {
      setUpdatedDisplayName(displayName);
    }
  }, [inEditMode, displayName]);

  const onClickSave = async () => {
    let image;
    if (newImage) {
      image = newImage.split(",")[1];
    }
    const body = {
      displayName: updatedDisplayName,
      image,
    };
    try {
      const response = await updateUser(username, body);
      setInEditMode(false);
      setUser(response.data);
      dispatch(updateSuccess(response.data));
    } catch (error) {
      setValidationErrors(error.response.data.validationErrors);
    }
  };

  const pendingApiCall = useApiProgress("put", "/api/1.0/users/" + username);

  const onChangeFile = (event) => {
    if (event.target.files.length < 1) {
      return;
    }

    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setNewImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const onClickCancel = () => {
    setModalVisible(false);
  };

  const onClickDeleteUser = async () => {
    await deleteUser(username);
    setModalVisible(false);
    {
      !isAdmin && dispatch(logoutSucces());
    }
    history.push("/");
  };

  const getPage = async () => {
    if (isAdmin) {
      try {
        await getVerificationRequests();
        history.push("/verifications-request");
      } catch (error) {
        console.error("Error getting verification requests:", error);
      }
    } else {
      console.log(
        "User is not an admin, can't access verification requests page."
      );
    }
  };
  const { displayName: displayNameError, image: imageError } = validationErrors;

  return (
    <div className="card text-center">
      <div className="card-header">
        <ProfileImageWithDefault
          className="rounded-circle shadow"
          width="200"
          height="200"
          alt={`${username} profile`}
          image={image}
          tempImage={newImage}
        />
      </div>
      <div className="card-body">
        {!inEditMode && (
          <>
            {" "}
            <h3>
              <span style={{ padding: "10px" }}>{displayName}</span>
              <span className="text-muted">
                <br /> @{username}
              </span>
            </h3>
            {editable && (
              <>
                <button
                  className="btn btn-success d-inline-flex"
                  onClick={() => setInEditMode(true)}
                >
                  <i className="material-icons me-1">edit</i>
                  {t("Edit")}
                </button>
                <div className="pt-2">
                  <button
                    className="btn btn-danger d-inline-flex"
                    onClick={() => setModalVisible(true)}
                  >
                    <i className="material-icons me-2">person_remove</i>
                    {t("Delete Account")}
                  </button>
                </div>
                <div className="pt-2">
                  <button
                    className="btn btn-secondary d-inline-flex"
                    onClick={() => setVerifiedRequest(true)}
                  >
                    <i className="material-icons me-2">verified</i>
                    {t("Verified user request")}
                  </button>{" "}
                </div>
                {admin && (
                  <>
                    {" "}
                    <div className="pt-2">
                      <button
                        className="btn btn-info d-inline-flex"
                        onClick={getPage}
                      >
                        <i className="material-icons me-2">verified</i>
                        {t("Verified User Application")}
                      </button>{" "}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
        <h4>
          {admin && (
            <div class="alert alert-secondary m-2 alert-sm" role="alert">
              {t("Be Careful This is Admin")}
              <div className="ms-auto">
                <i className="material-icons">shield</i>
                <i class="fa-regular fa-id-card"></i>
                <i className="material-icons">shield</i>
              </div>
            </div>
          )}
        </h4>
        {inEditMode && (
          <div>
            <Input
              label={t("Change Display Name")}
              defaultValue={displayName}
              onChange={(event) => {
                setUpdatedDisplayName(event.target.value);
              }}
              error={displayNameError}
            />
            <Input
              type="file"
              label={t("Change Profile Photo")}
              onChange={onChangeFile}
              error={imageError}
            />
            <div className="mt-2">
              <ButtonWithProgress
                className="btn btn-primary d-inline-flex mr-2"
                onClick={onClickSave}
                dispabled={pendingApiCall}
                pendingApiCall={pendingApiCall}
                text={
                  <>
                    <i className="material-icons">save</i>
                    {t("Save")}
                  </>
                }
              />
              <button
                className="btn btn-light d-inline-flex ml-1"
                onClick={() => setInEditMode(false)}
                disabled={pendingApiCall}
              >
                <i className="material-icons">close</i>
                {t("Cancel")}
              </button>
            </div>
          </div>
        )}

        {verifiedRequest && (
          <div>
            <Input
              label={t("Reason to be verified")}
              defaultValue={displayName}
            />
            <Input type="file" label={t("File to be verified")} />
            <div className="mt-2">
              <ButtonWithProgress
                className="btn btn-primary d-inline-flex mr-2"
                onClick={onClickSave}
                dispabled={pendingApiCall}
                pendingApiCall={pendingApiCall}
                text={
                  <>
                    <i className="material-icons">save</i>
                    {t("Save")}
                  </>
                }
              />
              <button
                className="btn btn-light d-inline-flex ml-1"
                onClick={() => setVerifiedRequest(false)}
                disabled={pendingApiCall}
              >
                <i className="material-icons">close</i>
                {t("Cancel")}
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal
        visible={modalVisible}
        title={t("Delete Account")}
        okButton={t("Delete Account")}
        onClickCancel={onClickCancel}
        onClickOk={onClickDeleteUser}
        message={t("Are you sure to delete your account?")}
        pendingApiCall={pendingApiCallDeleteUser}
      />
    </div>
  );
};

export default ProfileCard;
