import React, { Component } from 'react';
import Profile from "./profile";
import OpenLinks from "./Open-Links";
import Confirmation from "./Confirmation";
import PropTypes from 'prop-types';

class TopRow extends Component {
  render() {
    const { user, logout } = this.props;
    return (
      <div className="row top-row">
        <Profile user={user} logout={logout} />
        <OpenLinks />
        <Confirmation />
      </div>
    );
  }
}

TopRow.propTypes = {

};

export default TopRow;