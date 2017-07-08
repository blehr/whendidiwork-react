import React from "react";
import PropTypes from "prop-types";
import RaisedButton from "material-ui/RaisedButton";
import ActionDelete from "material-ui/svg-icons/action/delete";

const buttonStyle = {
  margin: "3px"
};

const StopWatch = props => {
  return (
    <div className="row stopwatch">
      <RaisedButton
        label="Start"
        backgroundColor="#536DFE"
        labelStyle={{ color: "#FFF" }}
        style={buttonStyle}
      />
      <RaisedButton
        label="Stop"
        backgroundColor="#FF5252"
        labelStyle={{ color: "#FFF" }}
        style={buttonStyle}
      />
      <RaisedButton label="Load in Form" style={buttonStyle} />
      <RaisedButton
        style={buttonStyle}
        labelPosition="after"
        icon={<ActionDelete />}
      />
    </div>
  );
};

StopWatch.propTypes = {};

export default StopWatch;
