import React from "react";
import { Link } from "react-router-dom";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import VerifiedBadge from "./VerifiedBadge";

const UserListItem = (props) => {
  const { user } = props;
  const { username, displayName, image, verified,admin } = user;

  return (
    <Link
      to={`/users/${username}`}
      className="list-group-item list-group-item-action"
    >
      <ProfileImageWithDefault
        className="rounded-circle"
        width="32"
        height="32"
        alt={`${username} profile`}
        image={image}
      />

      <span
        style={{
          padding: "10px",
        }}
      >
        {displayName}
      </span>
      <span className="text-muted">- @{username}</span>
      {verified && <VerifiedBadge isAdmin={admin}/>}
    </Link>
  );
};

export default UserListItem;
