import React, { useEffect, useState } from "react";
import {
  getNewPostCount,
  getFollowingPosts,
  getOldPosts,
  getNewPosts,
} from "../api/apiCalls";
import { useTranslation } from "react-i18next";
import PostView from "./PostView";
import { useApiProgress } from "../shared/ApiProgress";
import Spinner from "../components/Spinner";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const FollowingFeed = () => {
  const [posts, setPosts] = useState([]);
  const [newPostCount, setNewPostCount] = useState(0);
  const { t } = useTranslation();
  const { username } = useSelector((store) => ({
    username: store.username,
  }));

  const path = `/api/1.0/users/${username}/following/posts?page=`;

  const initialPostLoadProgress = useApiProgress("get", path);

  let lastPostId = 0;
  let firstPostId = 0;

  if (posts.length > 0) {
    firstPostId = posts[0].id;
    lastPostId = posts[posts.length - 1].id;
  }

  const oldPostPath = `/api/1.0/users/${username}/following/posts/${lastPostId}`;
  const loadOldPostProgress = useApiProgress("get", oldPostPath, true);

  const newPostPath = `/api/1.0/users/${username}/following/posts/${firstPostId}?direction=after`;
  const loadNewPostProgress = useApiProgress("get", newPostPath, true);

  useEffect(() => {
    const getCount = async () => {
      const response = await getNewPostCount(firstPostId, username);
      setNewPostCount(response.data.count);
    };
    let looper = setInterval(getCount, 1000);
    return function cleanup() {
      clearInterval(looper);
    };
  }, [firstPostId, username]);

  useEffect(() => {
    const loadPosts = async (page) => {
      try {
        const response = await getFollowingPosts(username,page);
        setPosts((previousPosts) => [...previousPosts, ...response.data]);
      } catch (error) {}
    };
    loadPosts();
  }, [username]);

  const loadOldPosts = async () => {
    const response = await getOldPosts(lastPostId, username);
    setPosts((previousPosts) => [...previousPosts, ...response.data]);
  };

  const loadNewPosts = async () => {
    const response = await getNewPosts(firstPostId);
    setPosts((previousPosts) => [...response.data, ...previousPosts]);
    setNewPostCount(0);
  };

  const onDeletePostSuccess = (id) => {
    setPosts((previousPosts) => previousPosts.filter((post) => post.id !== id));
  };

  return (
    <div>
      {newPostCount > 0 && (
        <div
          className="alert alert-info text-center mb-1"
          onClick={loadNewPostProgress ? () => {} : loadNewPosts}
          style={{ cursor: loadNewPostProgress ? "wait" : "pointer" }}
        >
          <i class="fa-regular fa-paper-plane fa-beat-fade p-2"></i>
          {loadNewPostProgress ? (
            <Spinner />
          ) : (
            t("There are new posts. Click here to see!")
          )}
          <i class="fa-regular fa-paper-plane fa-beat-fade ps-2"></i>
        </div>
      )}
      {posts.map((post) => (
        <div key={post.id} className="mb-">
          <PostView post={post} onDeletePost={onDeletePostSuccess}></PostView>
        </div>
      ))}
      {posts.length > 0 && !loadOldPostProgress && (
        <div
          className="alert alert-secondary text-center"
          onClick={loadOldPostProgress ? () => {} : loadOldPosts}
          style={{ cursor: loadOldPostProgress ? "wait" : "pointer" }}
        >
          {loadOldPostProgress ? <Spinner /> : t("Load old posts")}{" "}
        </div>
      )}
    </div>
  );
};

export default FollowingFeed;
