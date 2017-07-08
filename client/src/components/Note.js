import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

const Note = props => {
  return (
    <div>
      <TextField
        floatingLabelText="Note: "
        multiLine={true}
        rows={2}
        value={props.value}
        onChange={props.handleNoteChange}
        style={{width: "100%"}}
      />
    </div>
  );
};

Note.propTypes = {
  value: PropTypes.string,
  handleNoteChange: PropTypes.func
};

export default Note;