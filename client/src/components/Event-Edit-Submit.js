import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

const EventEditSubmit = props => {
  return (
    <div style={{width: "100%", padding: "25px", display: "flex", justifyContent: "space-between"}} >
      <RaisedButton label="Cancel" primary={true} onTouchTap={props.handleCancelEdit} />
      <RaisedButton label="Update" secondary={true} onTouchTap={props.handleUpdateSubmit} />
    </div>
  );
};

EventEditSubmit.propTypes = {
  handleCancelEdit: PropTypes.func,
  handleUpdateSubmit: PropTypes.func
};

export default EventEditSubmit;