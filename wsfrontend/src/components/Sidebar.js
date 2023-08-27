import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutSucces } from "../redux/authActions";
import ProfileImageWithDefault from "../components/ProfileImageWithDefault";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";
import { useParams, useHistory } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useLocation } from "react-router-dom";
const Sidebar = () => {
  const { displayName, isLoggedIn, image, username } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    displayName: store.displayName,
    image: store.image,
    username: store.username,
  }));
  const location = useLocation();
  const history = useHistory();
  const isAdmin = useSelector((store) => store.admin);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onLogoutSuccess = () => {
    dispatch(logoutSucces());
  };
 
  const handleNavigation = (path) => {
    history.push(path);
  };
  return (
    <div className="position-sticky top-0 start-0 bottom-1 bg-white">
      {isLoggedIn && (
        <div className="sidebar">
          <div className="card card-sidebar">
            <ul className="list-group " style={{ cursor: "pointer" }}>
              <li
                className="list-group-item nav-item-sidebar list-group-item-action text-dark"
                onClick={() => handleNavigation("/")}
              >
                <i className="fas fa-home fa-lg me-2"></i>
                {t("Home")}
              </li>
              <li
                className="list-group-item nav-item-sidebar list-group-item-action text-dark"
                onClick={() => handleNavigation("/users/" + username)}
              >
                <i className="fas fa-user fa-lg me-2"></i>
                {t("Profile")}
              </li>
              <li
                className="list-group-item nav-item-sidebar list-group-item-action text-dark"
                onClick={() => handleNavigation("/explore")}
              >
                <i className="fas fa-magnifying-glass fa-lg me-1"></i>{" "}
                {t("Explore")}
              </li>
              <li
                className="list-group-item nav-item-sidebar list-group-item-action text-dark"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-bell fa-lg me-2 text-dark"></i>{" "}
                {t("Notifications")}
              </li>
              <li
                className="list-group-item nav-item-sidebar list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-envelope fa-lg me-2 text-dark"></i>{" "}
                {t("Messages")}
              </li>
              {/* <li
                className="list-group-item nav-item-sidebar list-group-item-action  text-dark"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-user-group fa-lg me-2"></i> {t("Friends")}
              </li> */}
              <li
                className="list-group-item nav-item-sidebar  list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-bookmark fa-lg me-2 text-dark"></i>{" "}
                {t("Bookmarks")}
              </li>
              {/* <li
                className="list-group-item nav-item-sidebar  list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-circle-check fa-lg me-2 text-dark" onClick={()=>{}}></i>{" "}
                {t("Verified User")}
              </li> */}
              {isAdmin && (
                <li
                  className="list-group-item  nav-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNavigation("/verifications/applications")}
                >
                  <i className="fas fa-square-check fa-lg text-dark"></i>{" "}
                  {t("Verified User Application")}
                </li>
              )}
              <li
                className="list-group-item  nav-item-sidebar list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-circle-info fa-lg me-2 text-dark"></i>{" "}
                {t("Help")}
              </li>
              <li
                className="list-group-item  nav-item-sidebar list-group-item-action text-dark"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-cog fa-lg me-2"></i> {t("Settings")}
              </li>
              <li
                className="list-group-item nav-item-sidebar list-group-item-action"
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
              <li
                className="list-group-item nav-item-sidebar list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <em className="text-secondary">
                  {t("Share your coffee, explore the world!")}
                </em>
              </li>
              <li className="list-group-item nav-item-sidebar d-flex justify-content-center">
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
