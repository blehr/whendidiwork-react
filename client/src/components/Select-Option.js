import React from 'react';
import PropTypes from 'prop-types';

const SelectOption = props => {
  return (
    <option className="text-capitalize" value={props.value} >{props.value}</option>
  );
};

SelectOption.propTypes = {
  value: PropTypes.string
};

export default SelectOption;