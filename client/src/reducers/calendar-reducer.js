import {
  GET_CALENDAR_LIST,
  UNAUTH_USER,
  SET_CALENDAR,
  CREATE_CALENDAR,
  GET_CALENDAR_EVENTS,
  CALENDAR_DIALOG_OPEN,
  CALENDAR_DIALOG_CLOSE,
  CREATE_CALENDAR_NAME
} from "../actions/types.js";

const initialState = {
  calendars: [],
  showCalendarDialog: false,
  newCalendarName: "",
  timeZone: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CALENDAR_LIST:
      const lastCalendar = action.payload.calendars.filter(
        cal => cal.id === action.payload.lastUsed
      );
      return {
        ...state,
        calendars: [...action.payload.calendars],
        selectedCalendar: lastCalendar[0],
        timeZone: action.payload.timeZone
      };
    case UNAUTH_USER:
      return initialState;
    case CREATE_CALENDAR:
      return { ...state, calendars: [...state.calendars, action.payload] };
    case SET_CALENDAR:
      return { ...state, selectedCalendar: action.payload };
    case GET_CALENDAR_EVENTS:
      return { ...state, events: action.payload };
    case CALENDAR_DIALOG_OPEN:
      return { ...state, showCalendarDialog: true };
    case CALENDAR_DIALOG_CLOSE:
      return { ...state, showCalendarDialog: false, newCalendarName: "" };
    case CREATE_CALENDAR_NAME:
      return { ...state, newCalendarName: action.payload };
    default:
      return state;
  }
}
