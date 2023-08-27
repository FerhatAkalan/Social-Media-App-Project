import React, { useEffect, useState } from "react";
import { getPostsByHashtag } from "../api/apiCalls"; // Örnek bir API çağrısı
import PostView from "../components/PostView";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../components/Spinner";
import Sidebar from "../components/Sidebar";
import TrendList from "../components/TrendList";
const HashtagPage = () => {
  const [hashtagPosts, setHashtagPosts] = useState([]);
  const { hashtagName } = useParams(); // URL parametresinden hashtag adını al
  const { t } = useTranslation();

  useEffect(() => {
    const loadHashtagPosts = async () => {
      try {
        const response = await getPostsByHashtag(hashtagName);
        setHashtagPosts(response); // Hashtag'a ait postları set ediyoruz
      } catch (error) {
        console.error("Error loading hashtag posts:", error);
      }
    };
    loadHashtagPosts();
  }, [hashtagName]);

  return (
    <div className="container mt-3 pb-1">
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className="col-lg-7 col-md-7 mb-3">
        <h4 className="card card-header-hashtag"> #{hashtagName} {t("Related Posts")}</h4>
          {hashtagPosts.length === 0 ? (
            <div className="alert alert-info text-center">
              <Spinner />
              {t("No posts with this hashtag yet.")}
            </div>
          ) : (
            hashtagPosts.map((post) => (
              <div key={post.id} className="mb-">
                <PostView post={post}></PostView>
              </div>
            ))
          )}
        </div>
        <div className="col-lg-3 col-md-5 mb-3">
          {/* Trendler Sütunu */}
          <TrendList t={t} />
        </div>
      </div>
    </div>
    // <div>
    //   <h2>{t("Posts with")} #{hashtagName}</h2>
    //   {hashtagPosts.length === 0 ? (
    //     <div className="alert alert-info text-center">
    //       <Spinner />
    //       {t("No posts with this hashtag yet.")}
    //     </div>
    //   ) : (
    //     hashtagPosts.map((post) => (
    //       <div key={post.id} className="mb-">
    //         <PostView post={post}></PostView>
    //       </div>
    //     ))
    //   )}
    // </div>
  );
};

export default HashtagPage;
