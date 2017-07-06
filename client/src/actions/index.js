import axios from "axios";
import history from "../History";

import {
  AUTH_USER,
  UNAUTH_USER,
  GET_USER,
  GET_CALENDAR_LIST,
  CREATE_EVENT,
  GET_FILES,
  GET_SHEET_META,
  CREATE_CALENDAR,
  CREATE_SHEET,
  SET_DATE_START,
  SET_DATE_END,
  SET_TIME_START,
  SET_TIME_END,
  SET_CALENDAR,
  SET_SHEET,
  SET_NOTE,
  GET_CALENDAR_EVENTS,
  CLEAR_FORM,
  SET_EDIT_EVENT,
  SHOW_FORM_ERROR,
  APPLY_RADIO_DATE_SHORTCUT,
  SHEET_DIALOG_CLOSE,
  SHEET_DIALOG_OPEN,
  CALENDAR_DIALOG_CLOSE,
  CALENDAR_DIALOG_OPEN,
  CREATE_SHEET_NAME,
  CREATE_CALENDAR_NAME,
  RESPONSE_DIALOG_CLOSE,
  RESPONSE_DIALOG_OPEN,
  SET_ERROR,
  SET_MESSAGE
} from "./types.js";

export const authUser = id => {
  return {
    type: AUTH_USER,
    payload: id
  };
};

export const unauthUser = () => {
  return dispatch => {
    axios({
      url: `/api/logout`,
      method: "get",
      withCredentials: true
    })
      .then(response => {
        if (response.data === "bye") {
          history.push("/login");
          dispatch({
            type: UNAUTH_USER
          });
        }
      })
      .catch(err => dispatch(setError(err)));
  };
};

export const setError = err => ({
  type: SET_ERROR,
  payload: err
});
export const setMessage = msg => ({
  type: SET_MESSAGE,
  payload: msg
});

export const showFormError = () => ({
  type: SHOW_FORM_ERROR
});

export const checkForUser = () => {
  return dispatch => {
    axios({
      url: `/api/user`,
      method: "get",
      withCredentials: true
    })
      .then(response => {
        if (!response.data) {
          history.push("/login");
        } else {
          history.push("/");
          dispatch(authUser(response.data._id));
          dispatch({
            type: GET_USER,
            payload: response.data
          });
          dispatch(getCalendarList());
          dispatch(getFiles());
          if (response.data.lastUsed.calendar) {
            dispatch(getCalendarEvents(response.data.lastUsed.calendar));
          }
          if (response.data.lastUsed.sheet) {
            dispatch(getSheetMeta(response.data.lastUsed.sheet));
          }
        }
      })
      .catch(err => {
        history.push("/login");
      });
  };
};

export const getUser = id => {
  return dispatch => {
    if (id == null) {
      return {
        type: UNAUTH_USER
      };
    }
    axios({
      url: `/api/user`,
      method: "get",
      withCredentials: true
    })
      .then(response => {
        if (response.data.lastUsed.calendar) {
          dispatch(getCalendarEvents(response.data.lastUsed.calendar));
        }

        if (response.data.lastUsed.sheet) {
          dispatch(getSheetMeta(response.data.lastUsed.sheet));
        }
        console.log(response.data);
        dispatch({
          type: GET_USER,
          payload: response.data
        });
      })
      .catch(err => dispatch(setError(err)));
  };
};

export const getCalendarList = () => {
  return dispatch => {
    axios({
      method: "get",
      url: `/api/getCalendarList`,
      withCredentials: true
    })
      .then(response => {
        dispatch({
          type: GET_CALENDAR_LIST,
          payload: response.data
        });
      })
      .catch(err => console.log(err));
  };
};

export const getFiles = () => {
  return dispatch => {
    axios({
      method: "get",
      url: `/api/getFiles`,
      withCredentials: true
    })
      .then(response => {
        dispatch({
          type: GET_FILES,
          payload: response.data
        });
      })
      .catch(err => console.log(err));
  };
};

export const setStartDate = startDate => {
  return {
    type: SET_DATE_START,
    payload: startDate
  };
};

export const setEndDate = endDate => {
  return {
    type: SET_DATE_END,
    payload: endDate
  };
};

export const setStartTime = startTime => {
  return {
    type: SET_TIME_START,
    payload: startTime
  };
};

export const setEndTime = endTime => {
  return {
    type: SET_TIME_END,
    payload: endTime
  };
};

export const setCalendar = calendar => ({
  type: SET_CALENDAR,
  payload: calendar
});

export const setSheet = sheet => ({
  type: SET_SHEET,
  payload: sheet
});

export const setNote = note => ({
  type: SET_NOTE,
  payload: note
});

export const clearForm = () => ({
  type: CLEAR_FORM
});

export const getCalendarEvents = id => {
  return dispatch => {
    axios({
      method: "get",
      url: `/api/getEvents/${id}`,
      withCredentials: true
    })
      .then(response => {
        dispatch({
          type: GET_CALENDAR_EVENTS,
          payload: response.data
        });
      })
      .catch(err => console.log(err));
  };
};

export const getSheetMeta = id => {
  return dispatch => {
    axios({
      method: "get",
      url: `/api/getSheetMeta/${id}`,
      withCredentials: true
    })
      .then(response => {
        dispatch({
          type: GET_SHEET_META,
          payload: response.data
        });
      })
      .catch(err => console.log(err));
  };
};

export const createEvent = (event, calendar, sheet) => {
  return dispatch => {
    axios({
      method: "post",
      url: `/api/createEvent/${calendar.id}/${sheet.id}`,
      withCredentials: true,
      data: {
        event: { ...event, timeZone: calendar.timeZone }
      }
    })
      .then(response => {
        dispatch({
          type: CREATE_EVENT,
          payload: response.data
        });
      })
      .then(response => {
        dispatch(clearForm());
        dispatch(getCalendarEvents(calendar.id));
        dispatch(getSheetMeta(sheet.id));
      })
      .catch(err => console.log(err));
  };
};

export const deleteEvent = (event, calendarId, sheetId) => {
  return dispatch => {
    axios({
      method: "delete",
      url: `/api/deleteEvent/${calendarId}/${event.id}`,
      withCredentials: true
    })
      .then(response => {
        dispatch(getCalendarEvents(calendarId));
        dispatch(getSheetMeta(sheetId));
        dispatch(setMessage("Event Successfully Deleted"));
      })
      .catch(err => console.log(err));
  };
};

export const editEvent = event => ({
  type: SET_EDIT_EVENT,
  payload: event
});

export const updateEvent = (event, calendar, sheetId) => {
  return dispatch => {
    axios({
      method: "put",
      url: `/api/updateEvent/${calendar.id}/${event.editEventId}`,
      withCredentials: true,
      data: {
        event: { ...event, timeZone: calendar.timeZone }
      }
    })
      .then(response => {
        dispatch({
          type: CREATE_EVENT,
          payload: response.data
        });
      })
      .then(response => {
        dispatch(clearForm());
        dispatch(getCalendarEvents(calendar.id));
        dispatch(getSheetMeta(sheetId));
      })
      .catch(err => console.log(err));
  };
};

export const applyRadioDateShortcut = value => ({
  type: APPLY_RADIO_DATE_SHORTCUT,
  payload: value
});

export const sheetDialogClose = () => ({
  type: SHEET_DIALOG_CLOSE
});
export const sheetDialogOpen = () => ({
  type: SHEET_DIALOG_OPEN
});
export const calendarDialogClose = () => ({
  type: CALENDAR_DIALOG_CLOSE
});
export const calendarDialogOpen = () => ({
  type: CALENDAR_DIALOG_OPEN
});

export const handleSheetNameChange = value => ({
  type: CREATE_SHEET_NAME,
  payload: value
});
export const addNewSheet = value => ({
  type: CREATE_SHEET,
  payload: value
});

export const createNewSheet = name => {
  return dispatch => {
    axios({
      method: "post",
      url: `/api/createSheet`,
      withCredentials: true,
      data: {
        sheet: name
      }
    })
      .then(response => {
        dispatch(sheetDialogClose());
        dispatch(addNewSheet(response.data));
        dispatch(setSheet(response.data));
        dispatch(getSheetMeta(response.data.id));
      })
      .catch(err => console.log(err));
  };
};

export const createNewCalendar = (name, timeZone) => {
  return dispatch => {
    axios({
      method: "post",
      url: `/api/createCalendar`,
      withCredentials: true,
      data: {
        calendar: name,
        timeZone
      }
    })
      .then(response => {
        console.log(response);
        dispatch(calendarDialogClose());
        dispatch(addNewCalendar(response.data));
        dispatch(setCalendar(response.data));
        dispatch(getCalendarEvents(response.data.id));
      })
      .catch(err => console.log(err));
  };
};

export const handleCalendarNameChange = value => ({
  type: CREATE_CALENDAR_NAME,
  payload: value
});
export const addNewCalendar = value => ({
  type: CREATE_CALENDAR,
  payload: value
});

export const responseDialogClose = () => ({
  type: RESPONSE_DIALOG_CLOSE
});
export const responseDialogOpen = () => ({
  type: RESPONSE_DIALOG_OPEN
});
