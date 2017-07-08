import React from "react";

const Footer = props => {
  return (
    <div>
      <footer className="clearfix">
        <div className="footer-div">
          <p className="footer-p">
            &#169; 2015 <a href="http://brandonlehr.com">Brandon Lehr</a>
          </p>
        </div>
      </footer>
      <div id="bottom-bar" />
    </div>
  );
};

Footer.propTypes = {};

export default Footer;
