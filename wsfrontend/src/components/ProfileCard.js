import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { useTranslation } from "react-i18next";
import Input from "../components/Input";
import {
  updateUser,
  deleteUser,
  createVerificationRequest,
  getFollowing,
  getFollowers,
  checkFollowStatusApi,
} from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { updateSuccess, logoutSucces } from "../redux/authActions";
import Modal from "../components/Modal";
import VerifiedBadge from "./VerifiedBadge";
import FollowButton from "./FollowButton";
import UserListItem from "./UserListItem";

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
  const { id, username, displayName, image, admin, verified } = user;
  const isAdmin = useSelector((store) => store.admin);
  const { displayName: displayNameError, image: imageError } = validationErrors;
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  useEffect(() => {
    setEditable(pathUsername === loggedInUsername);
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

  const handleCreateRequest = async () => {
    try {
      const formData = new FormData();
      formData.append("reason", reason);
      formData.append("multipartFile", attachment);

      await createVerificationRequest(username, formData);
      setVerifiedRequest(false);
      console.log("Verification request created successfully.");
    } catch (error) {
      console.error("Error creating verification request:", error);
    }
  };
  useEffect(() => {
    if (!verifiedRequest) {
      setReason("");
    } else {
      setReason(reason);
    }
  }, [verifiedRequest, reason]);

  const [followingUsers, setFollowingUsers] = useState([]);
  const [followerUsers, setFollowerUsers] = useState([]);
  const [isFollowing, setIsFollowing] = useState();
  const [isFollower, setIsFollower] = useState(false);

  const [followingListVisible, setFollowingListVisible] = useState(false);
  const [followerListVisible, setFollowerListVisible] = useState(false);

  const loadFollowingAndFollowerUsers = async () => {
    try {
      const followingResponse = await getFollowing(username);
      setFollowingUsers(followingResponse.data);
      const followerResponse = await getFollowers(username);
      setFollowerUsers(followerResponse.data);
    } catch (error) {
      console.error("Error loading following and follower users:", error);
    }
  };

  const checkIsFollower = () => {
    return followingUsers.some((user) => user.username === loggedInUsername);
  };

  useEffect(() => {
    loadFollowingAndFollowerUsers();
    if (loggedInUsername) {
      setIsFollower(checkIsFollower());
    }
  }, [username, loggedInUsername, isFollowing]);

  const openFollowingList = async () => {
    try {
      const followingResponse = await getFollowing(username);
      setFollowingUsers(followingResponse.data);
      setFollowingListVisible(true);
    } catch (error) {
      console.error("Error loading following users:", error);
    }
  };

  const openFollowerList = async () => {
    try {
      const followerResponse = await getFollowers(username);
      setFollowerUsers(followerResponse.data);
      setFollowerListVisible(true);
    } catch (error) {
      console.error("Error loading follower users:", error);
    }
  };

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await checkFollowStatusApi(loggedInUsername, username);
        setIsFollowing(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Takip durumu alınamadı:", error);
      }
    };
    fetchFollowStatus();
  }, [loggedInUsername, isFollowing, isFollower]);

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
        {!inEditMode && !verifiedRequest && (
          <>
            <h3 className="card">
              <div className="card-body p-2">
                <span style={{ padding: "10px" }}>{displayName}</span>
                <span className="text-muted">
                  <br /> @{username}
                </span>
                {verified && <VerifiedBadge isAdmin={admin} />}
              </div>
            </h3>
            {/* Following Users */}
            <div className="card my-2">
              <div className="row">
                <div className="col-6">
                  <div className="card btn btn-fav-link">
                    <div
                      className="card-body p-1"
                      style={{ cursor: "pointer" }}
                      onClick={openFollowingList}
                    >
                      <h6 className="card-title">{t("Followed")}</h6>
                      <h4 className="card-text">{followingUsers.length}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card btn btn-comment-link">
                    <div
                      className="card-body p-1"
                      style={{ cursor: "pointer" }}
                      onClick={openFollowerList}
                    >
                      <h6 className="card-title">{t("Followers")}</h6>
                      <h4 className="card-text">{followerUsers.length}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">{t("Profile Settings")}</div>
              <div className="card-body p-2">
                {loggedInUsername !== username && (
                  <div className="mt-2">
                    <FollowButton
                      loggedInUsername={loggedInUsername}
                      username={username}
                      isFollowing={isFollowing}
                      setIsFollowing={setIsFollowing}
                    />
                  </div>
                )}
                {(editable || isAdmin) && (
                  <>
                    {editable && (
                      <button
                        className="btn btn-update-account d-inline-flex"
                        onClick={() => setInEditMode(true)}
                      >
                        <i class="fa-regular fa-pen-to-square me-1 mt-1"></i>
                        {t("Edit")}
                      </button>
                    )}

                    <div className="pt-2">
                      <button
                        className="btn btn-delete-account d-inline-flex"
                        onClick={() => setModalVisible(true)}
                      >
                        <i className="material-icons me-2">person_remove</i>
                        {t("Delete Account")}
                      </button>
                    </div>
                    {(!verified || isAdmin) && (
                      <div className="pt-2">
                        <button
                          className="btn btn-verify-request d-inline-flex"
                          onClick={() => setVerifiedRequest(true)}
                        >
                          <i className="material-icons me-2">verified</i>
                          {t("Verified user request")}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
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
                className="btn btn-post d-inline-flex"
                onClick={onClickSave}
                disabled={pendingApiCall}
                pendingApiCall={pendingApiCall}
                text={
                  <>
                    <i className="material-icons">save</i>
                    {t("Save")}
                  </>
                }
              />
              <button
                className="btn btn-cancel d-inline-flex"
                onClick={() => setInEditMode(false)}
                disabled={pendingApiCall}
              >
                <i className="material-icons">close</i>
                {t("Cancel")}
              </button>
            </div>
          </div>
        )}
        {/* VerifiedRequest Form */}
        {verifiedRequest && (
          <div className="mt-2">
            <textarea
              className={`form-control ${reason === "" ? "is-invalid" : ""}`}
              value={reason}
              placeholder={t(
                "Reason to be verified: For example, I am a well-known person, I want my account verified."
              )}
              onChange={(event) => setReason(event.target.value)}
              style={{ height: "100px" }}
              required
            />
            <div className="invalid-feedback">
              {reason === "" && t("Please provide a reason for verification.")}
            </div>
            <div className="mt-2">
              <div className="input-group">
                <input
                  type="file"
                  className={`form-control ${
                    attachment === null ||
                    (attachment && attachment.type !== "application/pdf")
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file) {
                      if (file.type === "application/pdf") {
                        setAttachment(file);
                      } else {
                        setAttachment(null);
                      }
                    }
                  }}
                  accept=".pdf"
                />
                <div className="invalid-feedback">
                  {attachment === null
                    ? t("Please select a PDF file.")
                    : attachment.type !== "application/pdf" &&
                      t("Please select a valid PDF file.")}
                </div>
                <label className="input-group-text" htmlFor="inputGroupFile">
                  {t("Only PDF File")}
                </label>
              </div>
            </div>
            <div className="mt-2">
              <ButtonWithProgress
                className="btn btn-post m-1"
                onClick={handleCreateRequest}
                disabled={
                  pendingApiCall || reason === "" || attachment === null
                }
                pendingApiCall={pendingApiCall}
                icon="fa-regular fa-circle-check me-2 mr-2"
                text={<>{t("Send Request")}</>}
              />
              <button
                className="btn btn-cancel d-inline-flex ml-1"
                onClick={() => setVerifiedRequest(false)}
                disabled={pendingApiCall}
              >
                <i className="material-icons">close</i>
                {t("Cancel")}
              </button>
            </div>
          </div>
        )}
        {/* Admin Alert */}
        <h5>
          {admin && (
            <div className="card my-2">
              <div
                class="alert alert-secondary d-inline-block m-2"
                role="alert"
              >
                <div className="ms-auto">
                  {t("Be Careful This is Admin")}
                  <i class="fa-regular fa-id-card m-1"></i>
                </div>
              </div>
            </div>
          )}
        </h5>
      </div>
      {followingListVisible && (
        <Modal
          visible={followingListVisible}
          onClickCancel={() => setFollowingListVisible(false)}
          title={"📙"+t("Followed Users")}
          showCloseButton={true}
          message={
            followingUsers.length > 0 ? (
              <div className="card">
                <div className="list-group list-group-flush">
                  {followingUsers.map((user) => (
                    <UserListItem key={user.username} user={user} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card text-center p-3">
                {t("No followed users yet.")}
              </div>
            )
          }
        />
      )}

      {followerListVisible && (
        <Modal
          visible={followerListVisible}
          onClickCancel={() => setFollowerListVisible(false)}
          title={"📘" + t("Followers")}
          showCloseButton={true}
          message={
            followerUsers.length > 0 ? (
              <div className="card">
                <div className="list-group list-group-flush">
                  {followerUsers.map((user) => (
                    <UserListItem key={user.username} user={user} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card text-center p-3">
                {t("No followers yet.")}
              </div>
            )
          }
        />
      )}

      <Modal
        cancelButtonText={t("Cancel")}
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
