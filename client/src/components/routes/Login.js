import React, { Component } from "react";
import App from "../App";
import whendidiworkLogo from "../../assets/img/whendidiwork_icon.png";
import fullScreenshot from "../../assets/img/screenshot-whendidiwork-full.png";
import mobileScreenshot from "../../assets/img/screenshot-whendidiwork-mobile.png";
import RaisedButton from 'material-ui/RaisedButton';

class Login extends Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
  }
  login() {
    this.props.login();
  }
  render() {
    return (
      <App>
        <div className="container main-content">
          <div className="row">
            <div className="col-sm-6 login-message">
              <h1>whendidiwork?</h1>
              <p>
                Whendidiwork is a web app for tracking work, project, or hours
                of any kind, on your Google Calendar and a Google Spreadsheet.
                Create a spreadsheet for each job you desire to track. Then
                choose to enter events on your primary calendar, or create a new
                whendidiwork calendar.
              </p>
              <p>Keep track of everything in one convenient place!</p>
              <RaisedButton href="http://localhost:8081/auth/google" primary={true} label="Login with Google" className="login-google" style={{display: "block"}}/>
            </div>
            <div className="col-sm-6">
              <div className="logo-div">
                <img
                  src={whendidiworkLogo}
                  className="login-logo"
                  alt="whendidiwork logo"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <img
              src={fullScreenshot}
              className="screenshot screenshot-full img-rounded"
              alt="whendidiwork.com"
            />
            <img
              src={mobileScreenshot}
              className="screenshot screenshot-mobile img-rounded"
              alt="whendidiwork.com"
            />
          </div>
        </div>
      </App>
    );
  }
}

Login.propTypes = {};

export default Login;
