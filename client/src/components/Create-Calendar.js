import React from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

const CreateCalendar = props => {
  const actions = [
    <FlatButton label="Cancel" primary={true} onTouchTap={props.handleCalendarDialogClose} />,
    <FlatButton
      label="Submit"
      primary={true}
      keyboardFocused={true}
      onTouchTap={props.handleCalendarDialogSubmit}
    />
  ];
  return (
    <Dialog
      actions={actions}
      modal={false}
      open={props.showCalendarDialog}
      onRequestClose={props.handleCalendarDialogClose}
    >
      <h4>Create Calendar</h4>
      <TextField
        floatingLabelText="Create Calendar"
        onChange={props.handleCalendarNameChange}
        value={props.nameValue}
      />
    </Dialog>
  );
};

CreateCalendar.propTypes = {
  handleCalendarDialogClose: PropTypes.func,
  handleCalendarDialogSubmit: PropTypes.func,
  showCalendarDialog: PropTypes.bool,
  handleCalendarNameChange: PropTypes.func,
  nameValue: PropTypes.string
};

export default CreateCalendar;