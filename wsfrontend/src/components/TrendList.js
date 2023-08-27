import React, { useState, useEffect } from "react";
import { getTrends } from "../api/apiCalls";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
const TrendList = ({postSubmitted }) => {
  const [trends, setTrends] = useState([]);
  const history = useHistory();
  const {t} = useTranslation();
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await getTrends();
        setTrends(response.data);
      } catch (error) {
        console.error("Error fetching trends:", error);
      }
    };

    fetchTrends();
    // Her 5 saniyede bir güncelleme yapmak için bir interval oluşturuyoruz
    const interval = setInterval(fetchTrends, 15000);

    // Bileşen temizlendiğinde interval'i temizle
    return () => clearInterval(interval);
  }, [postSubmitted]);

  if (!trends || trends.length === 0) {
    return null;
  }
  const handleHashtagPostClick = (hashtagName) => {
    history.push(`/hashtags/${hashtagName}/posts`);
  };
  return (
    <>
      <div
        className="list-group list-group-trend list-group-flush"
        style={{ margin: "10px 0" }}
      >
        <div className="input-group">
          <input type="text" className="form-control" placeholder={t("Search...")} style={{borderRadius:"20px"}} />
          <div className="input-group-append ms-2">
            <button className="form-control btn btn-cancel" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="card card-trend">
        <div className="card-header-trend">{t("Trends for you")}</div>
        <ul
          className="list-group list-group-trend list-group-flush"
          style={{ cursor: "pointer" }}
        >
          {trends.map((trend, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-sidebar nav-item-sidebar list-group-item-action d-flex justify-content-between align-items-center"
              onClick={() => handleHashtagPostClick(trend.name)}
            >
              #{trend.name}
              <span className="badge badge-primary text-primary badge-pill">
                {trend.postCount} {t("Posts")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TrendList;
