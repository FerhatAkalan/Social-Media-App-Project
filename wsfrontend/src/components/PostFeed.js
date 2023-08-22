import React, { useEffect, useState } from "react";
import {
  getNewPostCount,
  getNewPosts,
  getOldPosts,
  getPosts,
} from "../api/apiCalls";
import { useTranslation } from "react-i18next";
import PostView from "./PostView";
import { useApiProgress } from "../shared/ApiProgress";
import Spinner from "../components/Spinner";
import { useParams } from "react-router-dom";

const PostFeed = () => {
  const [postPage, setPostPage] = useState({
    content: [],
    last: true,
    number: 0,
  });
  const [newPostCount, setNewPostCount] = useState(0);
  const { t } = useTranslation();
  const { username } = useParams();
  const path = username
    ? `/api/1.0/users/${username}/posts?page=`
    : "/api/1.0/posts?page=";

  const initialPostLoadProgress = useApiProgress("get", path);

  let lastPostId = 0;
  let firstPostId = 0;

  if (postPage.content.length > 0) {
    firstPostId = postPage.content[0].id;
    const lastPostIndex = postPage.content.length - 1;
    lastPostId = postPage.content[lastPostIndex].id;
  }

  const oldPostPath = username
    ? `/api/1.0/users/${username}/posts/${lastPostId}`
    : `/api/1.0/posts/${lastPostId}`;

  const loadOldPostProgress = useApiProgress("get", oldPostPath, true);

  const newPostPath = username
    ? `/api/1.0/users/${username}/posts/${firstPostId}?direction=after`
    : `/api/1.0/posts/${firstPostId}?direction=after`;

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
        const response = await getPosts(username, page);
        setPostPage((previousPostPage) => ({
          ...response.data,
          content: [...previousPostPage.content, ...response.data.content],
        }));
      } catch (error) {}
    };
    loadPosts();
  }, [username]);

  const loadOldPosts = async () => {
    const response = await getOldPosts(lastPostId, username);
    setPostPage((previousPostPage) => ({
      ...response.data,
      content: [...previousPostPage.content, ...response.data.content],
    }));
  };

  const loadNewPosts = async () => {
    const response = await getNewPosts(firstPostId);
    setPostPage((previousPostPage) => ({
      ...previousPostPage,
      content: [...response.data, ...previousPostPage.content],
    }));
    setNewPostCount(0);
  };

  const onDeletePostSuccess = (id) => {
    setPostPage((previousPostPage) => ({
      ...previousPostPage,
      content: previousPostPage.content.filter((post) => post.id !== id),
    }));
  };

  const { content, last } = postPage;

  if (content.length === 0) {
    return (
      <div className="alert alert-secondary text-center">
        {initialPostLoadProgress ? <Spinner /> : t("There are no posts")}
      </div>
    );
  }

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
      {content.map((post) => (
        <div key={post.id} className="mb-">
          <PostView post={post} onDeletePost={onDeletePostSuccess}></PostView>
        </div>
      ))}
      {!last && (
        <div
          className="alert alert-secondary text-center"
          onClick={loadOldPostProgress ? () => {} : loadOldPosts}
          style={{ cursor: loadOldPostProgress ? "wait" : "pointer" }}
        >
          {loadOldPostProgress ? <Spinner /> : t("Load old posts")}
        </div>
      )}
    </div>
  );
};

export default PostFeed;
