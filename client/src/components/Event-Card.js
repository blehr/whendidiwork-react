import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardActions,
  CardTitle,
  CardText
} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import Edit from "material-ui/svg-icons/editor/mode-edit";
import Delete from "material-ui/svg-icons/action/delete";
import { isAllDayEvent } from "../utils";

const cardStyle = {
  width: "90%",
  margin: "auto",
  marginBottom: "10px"
};

const EventCard = props => {
  return (
    <Card
      style={cardStyle}
      className={
        props.editId === props.event.id
          ? "animated bounceOut"
          : "animated bounceIn"
      }
    >
      <CardTitle
        title={props.event.summary}
        titleStyle={{ fontSize: "18px" }}
      />
      <CardText
        style={{
          fontSize: "16px",
          textAlign: "center",
          padding: 0
        }}
      >
        {isAllDayEvent(props.event)}
      </CardText>
      <CardActions
        style={{
          textAlign: "center"
        }}
      >
        <FlatButton
          label="Edit"
          labelPosition="after"
          primary
          icon={<Edit />}
          onTouchTap={() => props.handleSetEditClick(props.event)}
        />
        <FlatButton
          label="Delete"
          labelPosition="after"
          secondary
          icon={<Delete />}
          onTouchTap={() => props.handleDeleteClick(props.event)}
        />
      </CardActions>
    </Card>
  );
};

EventCard.propTypes = {
  event: PropTypes.object,
  editId: PropTypes.string,
  handleDeleteClick: PropTypes.func,
  handleSetEditClick: PropTypes.func
};

export default EventCard;
