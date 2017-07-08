import React from "react";
import PropTypes from "prop-types";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

const CalendarSelect = props => {
  return (
    <div>
      <SelectField
        floatingLabelText="Choose Calendar"
        value={props.value || null}
        onChange={props.handleCalendarChange}
        style={{width: "100%"}}
        errorText={props.error && !props.value && "Field is required"}
      >
        {props.calendars.map(calendar => {
          return (
            <MenuItem
              value={calendar}
              primaryText={calendar.summary}
              key={calendar.id}
            />
          );
        })}
      </SelectField>

    </div>
  );
};

CalendarSelect.propTypes = {
  calendars: PropTypes.array,
  handleCalendarChange: PropTypes.func,
  lastUsed: PropTypes.string
};

export default CalendarSelect;
