import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import App from '../App';
import TopRow from '../TopRow';
import * as actions from "../../actions";

class Home extends Component {
  componentDidMount() {
    this.props.getUser(this.props.auth.id);
  }
  
  render() {
    return (
      <App>
        <div className="container">
          <TopRow user={this.props.auth} logout={this.props.unauthUser} />
          <hr />
          
        </div>
      </App>
    );
  }
  
};

Home.propTypes = {
  
};
const mapStateToProps = ({ auth }) => ({
  auth
})

export default connect(mapStateToProps, actions)(Home);