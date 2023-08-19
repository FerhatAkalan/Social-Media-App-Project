import React, { useEffect, useState } from "react";
import { getLikedPosts } from "../api/apiCalls";
import PostView from "./PostView";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../components/Spinner";

const LikedPostFeed = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const { username } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    const loadLikedPosts = async () => {
      try {
        const response = await getLikedPosts(username);
        setLikedPosts(response.content); // Sadece beğenilen postları set ediyoruz
      } catch (error) {
        console.error("Error loading liked posts:", error);
      }
    };
    loadLikedPosts();
  }, [username,likedPosts]);

  return (
    <div>
      {likedPosts.length === 0 ? (
        <div className="alert alert-danger text-center">
          <Spinner />
          {t("No liked posts yet.")}
        </div>
      ) : (
        likedPosts.map((post) => (
          <div key={post.id} className="mb-">
            <PostView post={post}></PostView>
          </div>
        ))
      )}
    </div>
  );
};

export default LikedPostFeed;
