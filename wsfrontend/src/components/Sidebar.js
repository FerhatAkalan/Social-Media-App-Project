import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutSucces } from "../redux/authActions";
import ProfileImageWithDefault from "../components/ProfileImageWithDefault";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";
import { useParams, useHistory } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";

const Sidebar = () => {
  const { displayName, isLoggedIn, image, username } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    displayName: store.displayName,
    image: store.image,
    username: store.username,
  }));

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onLogoutSuccess = () => {
    dispatch(logoutSucces());
  };
  const history = useHistory();
  const isAdmin = useSelector((store) => store.admin);

  const getPage = async () => {
    try {
      history.push("/verifications/applications");
    } catch (error) {
      console.error("Error getting verification requests:", error);
    }
  };
  return (
    <div className="position-sticky top-0 start-0 bottom-1 bg-white">
      {isLoggedIn && (
        <div className="">
          <div className="card-body">
            <ul className="list-group">
              <li className="list-group-item list-group-item-action">
                <Link
                  to="/"
                  className="d-flex align-items-center text-dark"
                  style={{ textDecoration: "none" }}
                >
                  <i className="fas fa-home fa-lg me-2"></i>
                  {t("Home")}
                </Link>
              </li>
              <li className="list-group-item list-group-item-action">
                <Link
                  to={"/users/" + username}
                  className="d-flex align-items-center text-dark"
                  style={{ textDecoration: "none" }}
                >
                  <i className="fas fa-user fa-lg me-2"></i>
                  {t("Profile")}
                </Link>
              </li>
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-magnifying-glass fa-lg me-1"></i> {t("Explore")}
              </li>
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-bell fa-lg me-2 text-dark"></i>{" "}
                {t("Notifications")}
              </li>
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-envelope fa-lg me-2 text-dark"></i>{" "}
                {t("Messages")}
              </li>
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-user-group fa-lg me-2"></i> {t("Friends")}
              </li>
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-heart fa-lg me-2 text-dark"></i>{" "}
                {t("Favorites")}
              </li>
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-circle-check fa-lg me-auto text-dark" onClick={()=>{}}></i>{" "}
                {t("Verified User")}
              </li>
              {isAdmin && (
                <li
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={getPage}
                >
                  <i className="fas fa-square-check fa-lg text-dark" ></i>{" "}
                  {t("Verified User Application")}
                </li>
              )}
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-circle-info fa-lg me-2 text-dark"></i>{" "}
                {t("Help")}
              </li>
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-cog fa-lg me-2"></i> {t("Settings")}
              </li>
              <li
                className="list-group-item list-group-item-action"
                onClick={onLogoutSuccess}
              >
                <Link
                  to="/login"
                  className="d-flex align-items-center text-dark"
                  style={{ textDecoration: "none" }}
                >
                  <i class="fa-solid fa-right-from-bracket me-2 text-dark"></i>
                  {t("Logout")}
                </Link>
              </li>
              <li className="list-group-item list-group-item-action"  style={{ cursor: "pointer" }}>
                <em className="text-secondary">
                  {t("Share your coffee, explore the world!")}
                </em>
              </li>
              <li className="list-group-item d-flex justify-content-center">
                <LanguageSelector />
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
