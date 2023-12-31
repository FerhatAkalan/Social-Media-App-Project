import React, { useEffect } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
  deletePost,
  fetchLikeCount,
  checkLikeStatus,
  getLikedPosts,
  fetchLikedUsers,
} from "../api/apiCalls";
import { useState } from "react";
import { useApiProgress } from "../shared/ApiProgress";
import Modal from "../components/Modal";
import VerifiedBadge from "./VerifiedBadge";
import { likePost, unlikePost } from "../redux/authActions";
import UserListItem from "./UserListItem";
import { useHistory } from "react-router-dom";

const PostView = (props) => {
  const loggedInUser = useSelector((store) => store.username);
  const { post, onDeletePost } = props;
  const { user, content, timestamp, fileAttachment, id } = post;
  const { username, displayName, image, admin, verified } = user;
  const [modalVisible, setModalVisible] = useState(false);
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
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
  const [liked, setLiked] = useState();
  const [likeCount, setLikeCount] = useState(0);
  useEffect(() => {
    const loadLikeStatus = async () => {
      try {
        const response = await checkLikeStatus(id, loggedInUser);
        setLiked(response);
      } catch (error) {
        console.error("Error while loading like status:", error);
      }
    };
    loadLikeStatus();
  }, [id, loggedInUser]);

  const handleLikeClick = async () => {
    if (loggedInUser) {
      try {
        if (liked) {
          console.log();
          await dispatch(unlikePost(id, loggedInUser));
        } else {
          await dispatch(likePost(id, loggedInUser));
        }
        setLiked(!liked);
      } catch (error) {
        console.error("Error while liking/unliking the post:", error);
      }
    }
  };
  useEffect(() => {
    const fetchLikeCountGet = async () => {
      try {
        const response = await fetchLikeCount(id);
        setLikeCount(response.data);
      } catch (error) {
        console.error("Error fetching like count:", error);
      }
    };
    fetchLikeCountGet();
  }, [id, liked, loggedInUser]);

  const [likeListVisible, setLikeListVisible] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);

  const openLikeList = async () => {
    try {
      const response = await fetchLikedUsers(id);
      setLikedUsers(response);
      setLikeListVisible(true);
      console.error("Liked users response or data is undefined.");
    } catch (error) {
      console.error("Error fetching liked users:", error);
    }
  };

  const closeLikeList = () => {
    setLikeListVisible(false);
    setLikedUsers([]); // Beğenen kişileri sıfırlayın
  };
  const history = useHistory();

  const handlePostDetailsClick = () => {
    history.push(`/post-details/${id}`);
  };
  return (
    <>
      <div className="card p-1 post-container">
        <div className="d-flex">
          <Link to={`/users/${username}`}>
            <ProfileImageWithDefault
              Link={`/users/${username}`}
              image={image}
              width="32"
              height="32"
              className="rounded-circle m-1"
            />
          </Link>
          <div className="flex-fill m-auto px-2">
            <Link
              to={`/users/${username}`}
              className="text-dark"
              style={{ textDecoration: "none" }}
            >
              <h6 className="d-inline">
                <span>{displayName}</span>
                <span className="text-muted"> @{username}</span>
              </h6>
            </Link>

            {verified && <VerifiedBadge isAdmin={admin} />}
            <span class="mx-2"> · </span>
            <span>{formatted}</span>
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
        <div onClick={handlePostDetailsClick}>
          <div className="px-5 py-2 pb-3"> {content} </div>
          {fileAttachment && (
            <div className="ps-5">
              {fileAttachment.fileType.startsWith("image") && (
                <img
                  className="img-fluid img-thumbnail rounded"
                  style={{ maxWidth: "100%", maxHeight: "450px" }}
                  src={"images/attachment/" + fileAttachment.name}
                  alt={content}
                />
              )}
              {!fileAttachment.fileType.startsWith("image") && (
                <strong>
                  <em>{t("Post has unkown attachment")}</em>
                </strong>
              )}
            </div>
          )}
        </div>
        <hr class="text-black-50 my-1" />
        <div className="d-flex justify-content-around pb-1 py-">
          <div onClick={handlePostDetailsClick}>
            <button className="btn btn-comment-link">
              <i class="fa-regular fa-comment"></i>
            </button>
            <span 
              className="ms-1 btn btn-comment-link"
              style={{ cursor: "pointer" }}
            >
              {likeCount} {t("Comment")}
            </span>
          </div>
          <button className="btn btn-retweet-link">
            <i class="fa-solid fa-retweet"></i>
          </button>
          <div>
            <button className="btn btn-fav-link" onClick={handleLikeClick}>
              {liked ? (
                <i className="fa-solid fa-heart text-danger"></i>
              ) : (
                <i className="fa-regular fa-heart"></i>
              )}{" "}
            </button>
            <span
              className="ms-1 btn btn-fav-link"
              onClick={openLikeList}
              style={{ cursor: "pointer" }}
            >
              {likeCount} {t("Like")}
            </span>
          </div>
          <button className="btn btn-bookmark-link">
            <i class="fa-regular fa-bookmark"></i>
          </button>
          <button className="btn btn-share-link">
            <i class="fa-regular fa-share-from-square"></i>
          </button>
        </div>
      </div>
      <Modal
        visible={modalVisible}
        title={t("Delete Post")}
        onClickCancel={onClickCancel}
        cancelButtonText={t("Cancel")}
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

      {likedUsers.length !== 0 ? (
        <Modal
          visible={likeListVisible}
          onClickCancel={closeLikeList}
          title={"❤ "+t("Likes")+" ❤"}
          showCloseButton={true}
          message={
            <div className="card">
              <div className="list-group list-group-flush">
                {likedUsers.map((user) => (
                  <UserListItem key={user.username} user={user} />
                ))}
              </div>
            </div>
          }
        />
      ) : (
        <Modal
          visible={likeListVisible}
          onClickCancel={closeLikeList}
          title={"❤ "+t("Likes")+" ❤"}
          showCloseButton={true}
          message={t("No liked posts yet.")}
        />
      )}
    </>
  );
};

export default PostView;
