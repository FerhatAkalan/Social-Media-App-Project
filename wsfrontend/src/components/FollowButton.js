import React from "react";
import { followUser, unfollowUser } from "../api/apiCalls";
import { useTranslation } from "react-i18next";
const FollowButton = ({
  loggedInUsername,
  username,
  isFollowing,
  setIsFollowing,
}) => {
  const { t } = useTranslation();
  const handleFollow = async () => {
    try {
      await followUser(loggedInUsername, username);
      setIsFollowing(true);
    } catch (error) {
      console.error("Takip etme hatası:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(loggedInUsername, username);
      setIsFollowing(false);
    } catch (error) {
      console.error("Takipten çıkma hatası:", error);
    }
  };

  return (
    <>
      {!isFollowing ? (
        <button className="btn btn-follow m-1" onClick={handleFollow}>
          {t("Follow")}
        </button>
      ) : (
        <button className="btn btn-unfollow m-1" onClick={handleUnfollow}>
          {t("Unfollow")}
        </button>
      )}
    </>
  );
};

export default FollowButton;
