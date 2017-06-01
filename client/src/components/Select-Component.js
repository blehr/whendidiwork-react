import React from "react";
import PropTypes from "prop-types";
import SelectOption from "./Select-Option";

const SelectComponent = props => {
  return (
    <div>
      <select
        className="form-control text-capitalize"
        style={{ marginBottom: "10px" }}
        value={this.props.selectValue}
        onChange={e => this.props.onSelect(e.target.value)}
      >
        {props.options.map(o => <SelectOption value={o.value} key={o.value} />)}
      </select>
    </div>
  );
};

SelectComponent.propTypes = {
  onSelect: PropTypes.func,
  options: PropTypes.array
};

export default SelectComponent;
