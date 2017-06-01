import React from "react";
import PropTypes from "prop-types";

const Confirmation = props => {
  return (
    <div className="col-sm-4 col-sm-pull-4 confirmation">
      <h4>Confirmation</h4>
      <div className="panel panel-success">
        <div className="panel-heading">
          <h3 className="panel-title">{props.confirmedSummary}</h3>
        </div>
        <div className="panel-body">
          <span className="cal-event-start">{props.confirmedStart}</span>
          <br />
          <span className="cal-event-end">{props.confirmedEnd}</span>
        </div>
      </div>
    </div>
  );
};

Confirmation.propTypes = {
  confirmedSummary: PropTypes.string,
  confirmedStart: PropTypes.string
};

export default Confirmation;
