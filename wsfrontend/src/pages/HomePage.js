import React from "react";
import maintenance from "../assets/maintenance.jpg";
import UserList from "../components/UserList";
import PostSubmit from "../components/PostSubmit";
import { useSelector } from "react-redux";
import PostFeed from "../components/PostFeed";
import logo from "../assets/logo.png";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  const { isLoggedIn } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
  }));

  return (
    <div className="container mt-3 pb-1">
      <div className="row">
        <div className="col-lg-2 col-md-2 mb-3">
          <Sidebar />
        </div>
        <div className="col-lg-7 col-md-7 mb-3">
          <div className="mb-0">{isLoggedIn && <PostSubmit />}</div>
          <PostFeed />
        </div>
        <div className="col-lg-3 col-md-3 mb-3">
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
