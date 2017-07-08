import React from "react";
import PropTypes from "prop-types";
import DatePicker from "material-ui/DatePicker";
import moment from "moment";

const formatDate = date => moment(date).format("MMM DD, YYYY");

const DatePick = props => {
  return (
    <div>
      <DatePicker
        floatingLabelText={props.text}
        value={props.value}
        onChange={props.handleChange}
        formatDate={formatDate}
        textFieldStyle={{width: "100%"}}
        errorText={props.error && !props.value && "Field is required"}
      />
    </div>
  );
};

DatePick.propTypes = {
  handleChange: PropTypes.func,
  value: PropTypes.object,
  error: PropTypes.bool,
  text: PropTypes.string
};

export default DatePick;
