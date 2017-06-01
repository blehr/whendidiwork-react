import React from "react";
import PropTypes from "prop-types";
import PrimaryButton from "./Primary-Button";

const Profile = props => {
  return (
    <div className="col-sm-4 col-sm-push-8 top-row-profile">
      <div>
        <span id="display-name" >{props.user.name}</span>
        <br />
        <PrimaryButton handleClick={props.logout} text="Log Out" />
        <img
          src={props.user.profileImg}
          className="img-rounded"
          alt="profile"
          style={{width: "50px", height: "50px"}}
        />
      </div>
    </div>
  );
};

Profile.propTypes = {
  displayName: PropTypes.string,
  profileImg: PropTypes.any
};

export default Profile;
