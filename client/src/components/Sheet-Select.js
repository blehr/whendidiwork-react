import React from "react";
import PropTypes from "prop-types";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

const SheetSelect = props => {
  return (
    <div>
      <SelectField
        floatingLabelText="Choose Sheet"
        value={props.value}
        onChange={props.handleSheetChange}
        style={{width: "100%"}}
        errorText={props.error && !props.value && "Field is required"}
      >
        {props.sheets.map(sheet => {
          return (
            <MenuItem
              value={sheet}
              primaryText={sheet.name}
              key={sheet.id}
            />
          );
        })}
      </SelectField>

    </div>
  );
};

SheetSelect.propTypes = {
  sheets: PropTypes.array,
  handleSheetChange: PropTypes.func,
  lastUsed: PropTypes.string
};

export default SheetSelect;
