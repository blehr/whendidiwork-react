import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

export default function(ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      if (!this.props.auth.auth) {
        this.props.history.push('/login');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.auth.auth) {
        this.props.history.push('/login');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  const mapStateToProps = ({ auth }) => ({
    auth,
  });

  return withRouter(connect(mapStateToProps)(Authentication));
}