import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutSucces } from "../redux/authActions";
import ProfileImageWithDefault from "../components/ProfileImageWithDefault";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";

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

  return (
    <div className="d-none d-lg-block">
      {isLoggedIn && (
        <div className="card">
          <div className="card-body">
            <ul className="list-group">
              <Link className="list-group-item text-center" to="/">
                <img src={logo} width="48" alt="Hoaxify logo" />
              </Link>
              <br></br>

              <li className="list-group-item list-group-item-action">
                <Link
                  to="/"
                  className="d-flex align-items-center text-secondary"
                  style={{ textDecoration: "none" }}
                >
                  <i className="fas fa-home me-2"></i>
                  {t("Home")}
                </Link>
              </li>
              <li className="list-group-item list-group-item-action">
                <Link
                  to={"/users/" + username}
                  className="d-flex align-items-center text-dark"
                  style={{ textDecoration: "none" }}
                >
                  <ProfileImageWithDefault
                    image={image}
                    width="24"
                    height="24"
                    className="rounded-circle me-2"
                  />
                  <span>{displayName}</span>
                </Link>
              </li>
              <li className="list-group-item list-group-item-action">
                <Link
                  to={"/users/" + username}
                  className="d-flex align-items-center text-primary"
                  style={{ textDecoration: "none" }}
                >
                  <i className="fas fa-user me-2"></i>
                  {t("My Profile")}
                </Link>
              </li>

              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-magnifying-glass me-2"></i> {t("Explore")}
              </li>

              <br></br>

              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-bell me-2 text-warning"></i>{" "}
                {t("Notifications")}
              </li>
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-envelope me-2 text-secondary"></i>{" "}
                {t("Messages")}
              </li>
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-user-group me-2"></i> {t("Friends")}
              </li>
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-circle-check me-2 text-info"></i>{" "}
                {t("Verified User")}
              </li>
              <br></br>
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-circle-info me-2 text-success"></i>{" "}
                {t("Help")}
              </li>
              <li
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-cog me-2"></i> {t("Settings")}
              </li>
              <li className="list-group-item" onClick={onLogoutSuccess}>
                <Link
                  to="/login"
                  className="d-flex align-items-center"
                  style={{ textDecoration: "none" }}
                >
                  <i class="fa-solid fa-right-from-bracket me-2"></i>
                  {t("Logout")}
                </Link>
              </li>
              {/* Add more buttons for other functionalities */}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
