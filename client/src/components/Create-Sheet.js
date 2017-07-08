import React from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

const CreateSheet = props => {
  const actions = [
    <FlatButton label="Cancel" primary={true} onTouchTap={props.handleSheetDialogClose} />,
    <FlatButton
      label="Submit"
      primary={true}
      keyboardFocused={true}
      onTouchTap={props.handleSheetDialogSubmit}
    />
  ];
  return (
    <Dialog
      actions={actions}
      modal={false}
      open={props.showSheetDialog}
      onRequestClose={props.handleSheetDialogClose}
    >
      <h4>Create Sheet: whendidiwork@...</h4>
      <TextField
        floatingLabelText="whendidiwork@"
        value={props.nameValue}
        onChange={props.handleSheetNameChange}
      />
      <p>Sheet Name: whendidiwork@{props.nameValue}</p>
    </Dialog>
  );
};

CreateSheet.propTypes = {
  handleSheetDialogClose: PropTypes.func,
  handleSheetDialogSubmit: PropTypes.func,
  showSheetDialog: PropTypes.bool,
  nameValue: PropTypes.string,
  handleSheetNameChange: PropTypes.func
};

export default CreateSheet;
