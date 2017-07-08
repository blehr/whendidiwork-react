import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

const FormSubmit = props => {
  return (
    <div style={{width: "100%", padding: "25px", textAlign: "center"}} >
      <RaisedButton label="Submit" primary={true} onTouchTap={props.handleSubmit} />
    </div>
  );
};

FormSubmit.propTypes = {
  handleSubmit: PropTypes.func
};

export default FormSubmit;