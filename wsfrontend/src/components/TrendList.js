import React from "react";

const TrendList = ({ trends, t }) => {
  return (
    <div className="card">
      <div className="card-header">{t("Trends for you")}</div>
      <ul className="list-group list-group-flush" style={{ cursor: "pointer" }}>
        {trends.map((trend, index) => (
          <li
            key={index}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            {trend.text}
            <span className="badge badge-primary text-primary badge-pill">
              {trend.posts} {t("Posts")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendList;
