import React, { useEffect, useState } from "react";
import { getUsers } from "../api/apiCalls";
import { useTranslation } from "react-i18next";
import UserListItem from "./UserListItem";
import { useApiProgress } from "../shared/ApiProgress";
import Spinner from "./Spinner";

const UserList = () => {
  const [page, setPage] = useState({
    content: [],
    size: 8,
    number: 0,
  });
  const [loadFailure, setLoadFailure] = useState(false);
  const pendingApiCall = useApiProgress("get","/api/1.0/users?page");

  useEffect(() => {
    loadUser();
  }, []);

  const onClickPrevious = () => {
    const previousPage = page.number - 1;
    loadUser(previousPage);
  };
  const onClickNext = () => {
    const nextPage = page.number + 1;
    loadUser(nextPage);
  };

  const loadUser = async (page) => {
    setLoadFailure(false);
    try {
      const response = await getUsers(page);
      setPage(response.data);
    } catch (error) {
      setLoadFailure(true);
    }
  };

  const { t } = useTranslation();
  const { content: users, last, first } = page;
  let actionDiv = (
    <div
      className="d-flex justify-content-between"
      style={{
        margin: "4px",
      }}
    >
      {first === false && (
        <button className="btn btn-post" onClick={onClickPrevious}>
          {t("Previous")}
        </button>
      )}
      {last === false && (
        <button className="btn btn-cancel float-end" onClick={onClickNext}>
          {t("Next")}
        </button>
      )}
    </div>
  );
  if (pendingApiCall) {
    actionDiv = <Spinner />;
  }
  return (
    <div className="card card-trend">
      <h3 className="card-header text-center">{t("Users")}</h3>
      <div className="list-group list-group-flush">
        {users.map((user) => (
          <UserListItem key={user.username} user={user} />
        ))}
      </div>
      {actionDiv}
      {loadFailure && (
        <div className="text-center text-danger">{t("Load Failure")}</div>
      )}
    </div>
  );
};

export default UserList;
