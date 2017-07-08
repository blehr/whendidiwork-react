import React from 'react';
import PropTypes from "prop-types";
import {
  Card,
  CardText
} from "material-ui/Card";
import FlatButton from 'material-ui/FlatButton';

const CreateSheetCalendarCard = props => {
  return (
    <Card style={{marginBottom: "10px"}}>
      <CardText
        style={{
          fontSize: "16px"
        }}
      >
      <FlatButton
        label="Create New Calendar"
        onTouchTap={props.calendarDialogOpen}
      >
      </FlatButton>
      <br />
      <FlatButton
        label="Create New Sheet"
        onTouchTap={props.sheetDialogOpen}
      >
      </FlatButton>
      </CardText>
    </Card>
  );
};

CreateSheetCalendarCard.propTypes = {
  calendarDialogOpen: PropTypes.func,
  sheetDialogOpen: PropTypes.func
}


export default CreateSheetCalendarCard;