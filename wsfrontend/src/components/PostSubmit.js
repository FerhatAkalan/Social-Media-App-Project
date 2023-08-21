import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { useSelector } from "react-redux";
import { postIt, postPostAttachment } from "../api/apiCalls";
import { useApiProgress } from "../shared/ApiProgress";
import ButtonWithProgress from '../components/ButtonWithProgress';
import Input from "../components/Input";
import AutoUploadImage from "./AutoUploadImage";

const PostSubmit = () => {
  const { t } = useTranslation();
  const { image } = useSelector((store) => ({ image: store.image }));
  const [focused, setFocused] = useState(false);
  const [post, setPost] = useState("");
  const [errors, setErrors] = useState({});
  const [newImage, setNewImage] = useState();
  const [attachmentId, setAttachmentId] = useState();


  useEffect(() => {
    if (!focused) {
      setPost("");
      setErrors({});
      setNewImage();
      setAttachmentId();
    }
  }, [focused]);

  useEffect(() => {
    setErrors({});
  }, [post]);

  const pendingApiCall = useApiProgress("post", "/api/1.0/posts", true);
  const pendingFileUpload = useApiProgress(
    "post",
    "/api/1.0/post-attachments",
    true
  );

  const onClickPostIt = async () => {
    const body = {
      content: post,
      attachmentId: attachmentId
    };
    try {
      await postIt(body);
      setFocused(false);
    } catch (error) {
      if (error.response.data.validationErrors) {
        setErrors(error.response.data.validationErrors);
      }
    }
  };

  const onChangeFile = (event) => {
    if (event.target.files.length < 1) {
      return;
    }

    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setNewImage(fileReader.result);
      uploadFile(file);
    };
    fileReader.readAsDataURL(file);
  };

  const uploadFile = async (file) => {
    const attachment = new FormData();
    attachment.append("file", file);
    const response = await postPostAttachment(attachment);
    setAttachmentId(response.data.id);
  };

  let textAreaClass = "mb-2 form-control";
  if (errors.content) {
    textAreaClass += " is-invalid";
  }

  return (
    <div className="card p-2">
      <div className="d-flex flex-wrap align-items-start">
        <div className="col-2 col-md-1">
          <ProfileImageWithDefault
            className="rounded-circle"
            image={image}
            width="32"
            height="32"
          />
        </div>
        <div className="col-10 col-md-11">
          <textarea
            className={textAreaClass}
            rows={focused ? "4" : "3"}
            onFocus={() => setFocused(true)}
            placeholder={t("What's happening?")}
            onChange={(event) => {
              setPost(event.target.value);
            }}
            value={post}
          ></textarea>

          <div className="invalid-feedback">{errors.content}</div>
          
          {focused && (
            <>
              {!newImage && <Input type="file" onChange={onChangeFile} />}
              {newImage && (
                <AutoUploadImage image={newImage} uploading={pendingFileUpload} />
              )}
              <div className="d-flex justify-content-end align-items-center">
                <ButtonWithProgress
                  className="btn btn-post m-1"
                  onClick={onClickPostIt}
                  text={t(" TalkIt")}
                  pendingApiCall={pendingApiCall}
                  disabled={pendingApiCall || pendingFileUpload}
                  icon="fa-regular fa-paper-plane me-1"
                />
                <button
                  className="btn btn-cancel"
                  onClick={() => setFocused(false)}
                  disabled={pendingApiCall}
                >
                  <i class="fa-solid fa-ban me-2"></i>
                  {t("Cancel")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostSubmit;
