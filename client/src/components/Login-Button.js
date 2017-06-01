import React from 'react';
import PropTypes from 'prop-types';
import PrimaryButton from './Primary-Button';


const LoginButton = props => {
  return (
    <div>
      <PrimaryButton  handleClick={props.handleClick} text="Log In"  />
    </div>
  );
};

LoginButton.propTypes = {
  
};

export default LoginButton;