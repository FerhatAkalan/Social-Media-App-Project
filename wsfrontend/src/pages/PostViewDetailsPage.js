import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostDetails } from "../api/apiCalls";
import PostView from "../components/PostView";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import { useTranslation } from "react-i18next";

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
        <div class="alert alert-primary d-inline-block m-2" role="alert">
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
                placeholder="Write a comment..."
              />
              <button className="btn btn-primary mt-2">Submit Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostViewDetails;
