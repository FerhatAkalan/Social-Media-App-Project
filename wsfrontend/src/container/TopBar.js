import React from "react";
import LanguageSelector from "../components/LanguageSelector";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logoutSucces } from "../redux/authActions";
import ProfileImageWithDefault from "../components/ProfileImageWithDefault";
const TopBar = (props) => {
  const { t } = useTranslation();

  const { username, isLoggedIn, displayName, image } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    username: store.username,
    displayName: store.displayName,
    image: store.image,
  }));

  const dispatch = useDispatch();

  const onLogoutSuccess = () => {
    dispatch(logoutSucces());
  };

  let links = (
    <div className="ms-auto">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <i className="fa-solid fa-house me-1"></i>
            {t("Home Page")}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            <i className="fa-solid fa-right-to-bracket me-1"></i>
            {t("Login")}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/signup">
            <i className="fa-solid fa-user-plus me-1"></i>
            {t("Sign Up")}
          </Link>
        </li>
        <li className="nav-item">
          <LanguageSelector />
        </li>
      </ul>
    </div>
  );

  if (isLoggedIn) {
    links = (
      <div className="ms-auto">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link d-flex" to="/">
              <i className="material-icons text-secondary me-1">home</i>
              {t("Home Page")}
            </Link>
          </li>
          <li className="nav-item">
            <div className="nav-link d-flex" style={{ cursor: "pointer" }}>
              <Link
                to={"/users/" + username}
                className="d-flex text-dark text-dark"
                style={{ textDecoration: "none" }}
              >
                <ProfileImageWithDefault
                  image={image}
                  width="24"
                  height="24"
                  className="rounded-circle me-1"
                />
                <span>{displayName}</span>
              </Link>
            </div>
          </li>
          <li className="nav-item">
            <Link className="nav-link d-flex" to={"/users/" + username}>
              <i className="material-icons text-info  me-1">person</i>
              {t("My Profile")}
            </Link>
          </li>
          <li className="nav-item" onClick={onLogoutSuccess}>
            <Link className="nav-link d-flex" to="/login">
              <i className="material-icons text-warning me-1">logout</i>
              {t("Logout")}
            </Link>
          </li>
          <li className="nav-item">
            <LanguageSelector />
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="shadow-sm bg-light">
      <nav className="navbar navbar-light container navbar-expand">
        <Link className="navbar-brand" to="/">
          <img src={logo} width="65" alt="Hoaxify logo" />
          <a className="navbar-brand ms-2">Social Cafe </a>
        </Link>
        <em className="navbar-text ms-auto">
          {t("Share your coffee, explore the world!")}
        </em>
        {links}
      </nav>
    </div>
  );
};

export default TopBar;
