import React, { Component } from "react";
import Profile from "./profile";
import OpenLinks from "./Open-Links";
import PropTypes from "prop-types";

class TopRow extends Component {
  render() {
    const { user, logout, sheetId } = this.props;
    return (
      <div className="row top-row">
        <Profile user={user} logout={logout} />
        <OpenLinks sheetId={sheetId} />
      </div>
    );
  }
}

TopRow.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func
};

export default TopRow;
