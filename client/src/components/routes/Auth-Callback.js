import React, { Component } from 'react';
import App from '../App';
import ReceiveAuth from '../Receive-Auth';

class Home extends Component {
  render() {
    return (
      <App>
        <ReceiveAuth />
      </App>
    );
  }
  
};

export default Home;