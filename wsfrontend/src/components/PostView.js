import React from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { deletePost } from "../api/apiCalls";
import { useState } from "react";
import { useApiProgress } from "../shared/ApiProgress";
import Modal from "../components/Modal";

const PostView = (props) => {
  const loggedInUser = useSelector((store) => store.username);
  const { post, onDeletePost } = props;
  const { user, content, timestamp, fileAttachment, id } = post;
  const { username, displayName, image, admin } = user;
  const [modalVisible, setModalVisible] = useState(false);

  const { i18n, t } = useTranslation();

  const pendingApiCall = useApiProgress("delete", `/api/1.0/posts/${id}`, true);

  const onClickDelete = async () => {
    await deletePost(id);
    onDeletePost(id);
  };

  const onClickCancel = async () => {
    setModalVisible(false);
  };

  const formatted = format(timestamp, i18n.language);
  const isAdmin = useSelector((store) => store.admin);
  const ownedByLoggedInUser = loggedInUser === username || isAdmin;

  return (
    <>
      <div className="card p-1">
        <div className="d-flex">
          <ProfileImageWithDefault
            Link={`/users/${username}`}
            image={image}
            width="32"
            height="32"
            className="rounded-circle m-1"
          />
          <div className="flex-fill m-auto px-2">
            <Link
              to={`/users/${username}`}
              className="text-dark"
              style={{ textDecoration: "none" }}
            >
              <div class="d-flex align-items-center">
                <h6 class="d-inline me-3">
                  <span>{displayName}</span>
                  <span class="text-muted"> @{username}</span>
                </h6>

                {admin && (
                  <div class="d-inline">
                    <i class="material-icons text-secondary align-middle">
                      shield
                    </i>
                  </div>
                )}

                <i class="material-icons text-info">
                  verified
                </i>

                <span class="mx-2"> · </span>
                <span>{formatted}</span>
              </div>
            </Link>
          </div>
          <div class="dropdown">
            <button
              class="btn btn-delete-link dropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fa-solid fa-ellipsis"></i>
            </button>
            <ul class="dropdown-menu">
              {ownedByLoggedInUser ? (
                <li>
                  <a
                    class="dropdown-item btn btn-delete-link"
                    onClick={() => setModalVisible(true)}
                  >
                    <i class="fa-regular fa-trash-can me-2"></i>
                    {t("Delete Post")}
                  </a>
                </li>
              ) : (
                <li>
                  <a class="dropdown-item btn btn-delete-link">
                    <i class="fa-solid fa-mug-hot me-2"></i>
                    {t("Social Cafe")}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="px-5 py-2"> {content} </div>
        {fileAttachment && (
          <div className="ps-5">
            {fileAttachment.fileType.startsWith("image") && (
              <img
                className="img-fluid img-thumbnail rounded"
                style={{ maxWidth: "100%", maxHeight: "395px" }}
                src={"images/attachment/" + fileAttachment.name}
                alt={content}
              />
            )}
            {!fileAttachment.fileType.startsWith("image") && (
              <strong>
                <em>Post has unkown attachment</em>
              </strong>
            )}
          </div>
        )}
        <hr class="text-black-50 my-1" />
        <div className="d-flex justify-content-around pb-1 py-1">
          <i class="fa-regular fa-comment"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-regular fa-heart"></i>
          <i class="fa-regular fa-bookmark"></i>
          <i class="fa-regular fa-share-from-square"></i>
        </div>
      </div>
      <Modal
        visible={modalVisible}
        title={t("Delete Post")}
        onClickCancel={onClickCancel}
        onClickOk={onClickDelete}
        message={
          <div>
            <div>
              <strong>{t("Are you sure to delete Post?")}</strong>
            </div>
            <span>{content}</span>
          </div>
        }
        pendingApiCall={pendingApiCall}
        okButton={t("Delete Post")}
      />
    </>
  );
};

export default PostView;
