import React, { useState } from "react";
import UserList from "../components/UserList";
import PostSubmit from "../components/PostSubmit";
import { useSelector } from "react-redux";
import PostFeed from "../components/PostFeed";
import Sidebar from "../components/Sidebar";
import { useTranslation } from "react-i18next";
import FollowingFeed from "../components/FollowingFeed";
const HomePage = () => {
  const { isLoggedIn,username } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    username: store.username,
  }));
  const [activeTab, setActiveTab] = useState("YOUR_FEED");
  const { t} = useTranslation();

  const loadYourFeed = () => {
    setActiveTab("YOUR_FEED");
  };

  const loadFollowingFeed = () => {
    setActiveTab("FOLLOWING_FEED");
  };
  
  return (
    <div className="container mt-3 pb-1">
      <div className="row">
        <div className="col-lg-2 col-md-2 mb-3">
          <Sidebar />
        </div>
        <div className="col-lg-7 col-md-7 mb-3">
          <div className="mb-0">
           {isLoggedIn &&( <div>
              <div className="btn-group mb-2">
                <div
                  className={`btn btn-light btn-lg tab2-button ${
                    activeTab === "YOUR_FEED" ? "active" : ""
                  }`}
                  onClick={loadYourFeed}
                >
                  {t('For You')}
                </div>
                <div
                  className={`btn btn-light btn-lg ms-2 tab2-button ${
                    activeTab === "FOLLOWING_FEED" ? "active" : ""
                  }`}
                  onClick={loadFollowingFeed}
                >
                  {t('Followed')}
                </div>
              </div>
            </div>)}
            {isLoggedIn && <PostSubmit />}
            {activeTab === "YOUR_FEED" && <PostFeed />}
            {activeTab === "FOLLOWING_FEED" && <FollowingFeed />}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 mb-3">
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
