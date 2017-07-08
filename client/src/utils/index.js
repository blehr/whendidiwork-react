import moment from "moment";
import React from "react";

export const formatDate = date =>
  moment(date).format("ddd, MMM DD, YYYY hh:mma");

export const isAllDayEvent = event => {
  if (!event.start) return event.status; 
  if (event.start.date) {
    return formatDate(event.start.date);
  }
  return (
    <div>
      {formatDate(event.start.dateTime)}
      <br />
      {formatDate(event.end.dateTime)}
    </div>
  );
};

export const scrollToTop = () => {
  var timerID = setInterval(function() {
      window.scrollBy(0, -5);

      if (window.pageYOffset <= 0) {
        clearInterval(timerID)
      };
    }, 13);
}
