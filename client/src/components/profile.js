import React from "react";
import PropTypes from "prop-types";
import RaisedButton from 'material-ui/RaisedButton';

const Profile = props => {
  return (
    <div className="col-sm-4 col-sm-push-8 top-row-profile">
      <div>
        <span id="display-name" >{props.user.name}</span>
        <br />
        <RaisedButton onTouchTap={props.logout} label="Log Out" primary={true} />
        <img
          src={props.user.profileImg}
          className="img-rounded"
          alt="profile"
          style={{width: "36px", height: "36px", marginLeft: "5px"}}
        />
      </div>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func
};

export default Profile;
