import React from "react";
import TrendList from "../components/TrendList";
import Sidebar from "../components/Sidebar";

const ExplorePage = () => {
  return (
    <div className="explore-page">
      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-2 col-md-2 mb-3">
            <Sidebar />
          </div>
          <div className="col-lg-9 col-md-9">
            <TrendList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
