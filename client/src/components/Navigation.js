import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

const Navigation = ({ location }) => {
  return (
    <nav>
      <ul>
        <li>
          {location.pathname === "/login"
            ? <a href="http://localhost:8081/auth/google">LOG IN</a>
            : <Link to="/">HOME</Link>}
        </li>
        <li><Link to="/faq">FAQ</Link></li>
      </ul>
    </nav>
  );
};

Navigation.propTypes = {
  location: PropTypes.object
};

export default withRouter(Navigation);
