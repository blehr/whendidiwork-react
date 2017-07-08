import React from "react";
import PropTypes from "prop-types";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";

const RadioDateShortcuts = props => {
  return (
    <RadioButtonGroup
      name="dateShortcut"
      valueSelected={props.startValue}
      onChange={props.handleRadioDateChange}
      style={{fontSize: ".85em"}}
    >
      <RadioButton value="same" label="Ends Same Day" style={{}} />
      <RadioButton value="next" label="Ends Next Day" style={{}} />
      <RadioButton value="none" label="Other" style={{}} />
    </RadioButtonGroup>
  );
};

RadioDateShortcuts.propTypes = {
  startValue: PropTypes.string,
  handleRadioDateChange: PropTypes.func
};

export default RadioDateShortcuts;
