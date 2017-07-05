import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardTitle,
  CardText
} from "material-ui/Card";
import { isAllDayEvent } from "../utils";

const StopWatch = ({ createdEvent }) => {
  return (
      <Card style={{minHeight: "75px", textAlign: "center", maxWidth: "320px", margin: "auto"}}>
        <CardTitle
          title={createdEvent && createdEvent.summary}
          titleStyle={{ fontSize: "18px" }}
          style={{ padding: "0 16px" }}
        />
        <CardText
          style={{
            fontSize: "16px",
            textAlign: "center",
            padding: 0
          }}
        >
          {createdEvent && isAllDayEvent(createdEvent)}
        </CardText>
      </Card>
  );
};

StopWatch.propTypes = {
  createdEvent: PropTypes.object,
};

export default StopWatch;
