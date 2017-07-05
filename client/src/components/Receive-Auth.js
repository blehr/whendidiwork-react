import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actions from "../actions";

class ReceiveAuth extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.authUser(this.props.match.params.id);
      this.props.history.push("/");
    } else {
      this.props.history.push("/login");
    }
  }

  render() {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
})

export default withRouter(connect(mapStateToProps, actions)(ReceiveAuth));
