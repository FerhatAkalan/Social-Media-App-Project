import React, { useEffect, useState } from "react";
import maintenance from "../assets/maintenance2.jpg";
import ProfileCard from "../components/ProfileCard";
import { getUser } from "../api/apiCalls";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useTranslation } from "react-i18next";
import { useApiProgress } from "../shared/ApiProgress";
import Spinner from "../components/Spinner";
import PostFeed from "../components/PostFeed";
import Sidebar from "../components/Sidebar";
import LikedPostFeed from "../components/LikedPostFeed";
const UserPage = () => {
  const [user, setUser] = useState({});
  const [notFound, setNotFound] = useState(false);
  const { username } = useParams();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("POSTS");
  const pendingApiCall = useApiProgress(
    "get",
    "/api/1.0/users/" + username,
    true
  );

  useEffect(() => {
    setNotFound(false);
  }, [user]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getUser(username);
        setUser(response.data);
      } catch (error) {
        setNotFound(true);
      }
    };
    loadUser();
  }, [username]);
  if (notFound) {
    return (
      <div className="container">
        {" "}
        <div className="alert alert-danger text-center">
          <div>
            <i className="material-icons" style={{ fontSize: "48px" }}>
              error
            </i>
          </div>
          {t("User not found!")}
        </div>
      </div>
    );
  }
  if (pendingApiCall || user.username !== username) {
    return <Spinner />;
  }

  const loadUserPosts = () => {
    setActiveTab("POSTS");
  };
  const loadUserLikes = () => {
    setActiveTab("LIKES");
  };
  return (
    <div class="container mt-3">
      <div class="row">
        <div className="col-md-2">
          <Sidebar user={user} />
        </div>
        <div className="col-md-6">
          <div className="btn-group mb-2">
            <div
              className={`btn btn-light btn-lg tab-button ${
                activeTab === "POSTS" ? "active" : ""
              }`}
              onClick={loadUserPosts}
            >
              {t("POSTS")}
            </div>
            <div
              className={`btn btn-light btn-lg ms-2 tab-button ${
                activeTab === "LIKES" ? "active" : ""
              } ${activeTab === "LIKES" ? "like-active" : ""}`}
              onClick={loadUserLikes}
            >
              {t("LIKES")}
            </div>
          </div>
          {activeTab === "POSTS" && <PostFeed username={username} />}
          {activeTab === "LIKES" && <LikedPostFeed username={username} />}
        </div>

        <div className="col-md-4">
          <ProfileCard user={user} />
          <h1 class="text-center">{t("Profile")}</h1>
          <img
            class="rounded mx-auto d-block"
            width="200"
            src={maintenance}
            alt="Maintenance"
          />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
