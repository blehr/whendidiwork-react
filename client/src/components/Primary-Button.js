import React from "react";
import PropTypes from "prop-types";

const PrimaryButton = props => {
  return (
    <button
      type="button"
      onClick={props.handleClick}
      className="btn btn-primary logout"
    >
      {props.text}
    </button>
  );
};

PrimaryButton.propTypes = {
  logout: PropTypes.func,
  text: PropTypes.string
};

export default PrimaryButton;
