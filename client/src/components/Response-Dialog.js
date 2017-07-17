import React from "react";
import PropTypes from "prop-types";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import Confirmation from "./Confirmation";
import CircularProgress from "material-ui/CircularProgress";

const ResponseDialog = props => {
  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onTouchTap={props.handleResponseDialogClose}
    />
  ];
  return (
    <Dialog
      Title="Dialog Title"
      actions={props.isFetching ? [] : actions}
      modal={false}
      open={props.showResponseDialog}
      onRequestClose={props.handleResponseDialogClose}
    >
      {props.createdEvent && <Confirmation createdEvent={props.createdEvent} />}
      {props.isFetching &&
        <div style={{ width: "80px", height: "80px", margin: "auto" }}>
          <CircularProgress size={80} thickness={5} />
        </div>}
      {props.error &&
        <p style={{ textAlign: "center" }}>
          {props.error}
        </p>}
      {props.message &&
        <p style={{ textAlign: "center" }}>
          {props.message}
        </p>}
    </Dialog>
  );
};

ResponseDialog.propTypes = {
  handleResponseDialogClose: PropTypes.func,
  showResponseDialog: PropTypes.bool,
  createdEvent: PropTypes.object,
  error: PropTypes.string,
  message: PropTypes.string
};

export default ResponseDialog;
