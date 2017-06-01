import React from "react";
import PropTypes from "prop-types";

const OpenLinks = props => {
  return (
    <div className="col-sm-4 col-sm-pull-4 open-links">
      <div className="">
        <a className="primary" href="https://calendar.google.com">
          Open Calendar
        </a>
        <br />
        <a className="primary" href={props.sheetLink}>Open Sheet</a>
        <br />
      </div>
    </div>
  );
};

OpenLinks.propTypes = {
  sheetLink: PropTypes.string
};

export default OpenLinks;
