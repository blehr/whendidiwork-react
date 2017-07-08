import React from "react";
import PropTypes from "prop-types";
import TimePicker from "material-ui/TimePicker";

const TimePick = props => {
  return (
    <div>
      <TimePicker
        floatingLabelText={props.text}
        format="ampm"
        value={props.value}
        onChange={props.handleTimeChange}
        textFieldStyle={{width: "100%"}}
        errorText={props.error && !props.value && "Field is required"}
      />
    </div>
  );
};

TimePick.propTypes = {
  handleTimeChange: PropTypes.func,
  value: PropTypes.object,
  error: PropTypes.bool,
  text: PropTypes.string
};

export default TimePick;
