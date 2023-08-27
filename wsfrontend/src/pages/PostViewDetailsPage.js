import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostDetails } from "../api/apiCalls";
import PostView from "../components/PostView";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import { useTranslation } from "react-i18next";
import ButtonWithProgress from "../components/ButtonWithProgress";
import TrendList from "../components/TrendList";

const PostViewDetails = () => {
  const { postId } = useParams();
  const loggedInUser = useSelector((store) => store.username);
  const { t } = useTranslation();
  const [postDetails, setPostDetails] = useState();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await getPostDetails(loggedInUser, postId);
        setPostDetails(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
        setPostDetails(null);
      }
    };
    getPost();
  }, [postId]);

  if (!postDetails) {
    return (
      <div className="card my-2 text-center">
        <div className="alert alert-primary d-inline-block m-2" role="alert">
          <div>
            <Spinner />
          </div>
          <div className="ms-auto">{t("Loading...")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-3 pb-1">
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className="col-lg-8 col-md-7 mb-3">
          <PostView post={postDetails} onDeletePost={() => {}} />
          <div className="card" style={{ borderRadius: "0px" }}>
            <div className="card-body">
              <textarea
                className="form-control"
                rows="4"
                placeholder={t("Write a comment...")}
              />
              <div className="d-flex justify-content-end align-items-center pt-1">
                <ButtonWithProgress
                  className="btn btn-post m-1"
                  text={t("Submit Comment")}
                  icon="fa-regular fa-paper-plane me-1"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-5 mb-3">
          {/* Trendler Sütunu */}
          <TrendList  t={t} />
        </div>
      </div>
    </div>
  );
};

export default PostViewDetails;
