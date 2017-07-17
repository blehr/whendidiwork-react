import moment from "moment";
import {
  SET_DATE_START,
  SET_DATE_END,
  SET_TIME_START,
  SET_TIME_END,
  SET_EDIT_EVENT,
  SET_NOTE,
  CREATE_EVENT,
  CLEAR_FORM,
  SHOW_FORM_ERROR,
  APPLY_RADIO_DATE_SHORTCUT,
  SET_SHEET,
  GET_FILES,
  RESPONSE_DIALOG_CLOSE,
  RESPONSE_DIALOG_OPEN,
  SET_ERROR,
  SET_MESSAGE,
  IS_FETCHING
} from "../actions/types.js";
const initialState = {
  isFetching: false,
  isEditing: false,
  createdEvent: null,
  createEvent: { note: "" },
  showFormError: false,
  shortcut: "none",
  showResponseDialog: false,
  error: null,
  message: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_DATE_START:
      const endShortcut =
        state.shortcut === "next"
          ? new Date(moment(action.payload).add(1, "d"))
          : state.shortcut === "same" ? action.payload : null;
      return {
        ...state,
        createEvent: {
          ...state.createEvent,
          startDate: action.payload,
          endDate: endShortcut
        }
      };
    case APPLY_RADIO_DATE_SHORTCUT:
      const end =
        action.payload === "next"
          ? new Date(moment(state.createEvent.startDate).add(1, "d"))
          : action.payload === "same" ? state.createEvent.startDate : null;
      return {
        ...state,
        shortcut: action.payload,
        createEvent: { ...state.createEvent, endDate: end }
      };
    case SET_DATE_END:
      return {
        ...state,
        createEvent: { ...state.createEvent, endDate: action.payload }
      };
    case SET_TIME_START:
      return {
        ...state,
        createEvent: { ...state.createEvent, startTime: action.payload }
      };
    case SET_TIME_END:
      return {
        ...state,
        createEvent: { ...state.createEvent, endTime: action.payload }
      };
    case GET_FILES:
      const lastUsedSheet = action.payload.sheets.filter(
        sheet => sheet.id === action.payload.lastUsed
      );
      return {
        ...state,
        createEvent: {
          ...state.createEvent,
          note:
            lastUsedSheet.length > 0
              ? lastUsedSheet[0].name.substring(12) + ": "
              : ""
        }
      };
    case SET_NOTE:
      return {
        ...state,
        createEvent: { ...state.createEvent, note: action.payload }
      };
    case SET_SHEET:
      return {
        ...state,
        createEvent: {
          ...state.createEvent,
          note: action.payload.name.substring(12) + ": "
        }
      };
    case CREATE_EVENT:
      return {
        ...state,
        createdEvent: action.payload,
        showResponseDialog: true
      };
    case SHOW_FORM_ERROR:
      return { ...state, showFormError: true };
    case SET_EDIT_EVENT:
      return {
        ...state,
        isEditing: true,
        shortcut: "none",
        createEvent: {
          startDate: new Date(action.payload.start.dateTime),
          startTime: new Date(action.payload.start.dateTime),
          endDate: new Date(action.payload.end.dateTime),
          endTime: new Date(action.payload.end.dateTime),
          note: action.payload.summary,
          editEventId: action.payload.id
        }
      };
    case RESPONSE_DIALOG_CLOSE:
      return {
        ...state,
        showResponseDialog: false,
        createdEvent: null,
        error: null,
        message: null
      };
    case RESPONSE_DIALOG_OPEN:
      return { ...state, showResponseDialog: true };
    case SET_ERROR:
      return { ...state, error: action.payload, showResponseDialog: true };
    case SET_MESSAGE:
      return { ...state, message: action.payload, showResponseDialog: true };
    case IS_FETCHING: 
      return { ...state, isFetching: action.payload };
    case CLEAR_FORM:
      return {
        ...state,
        createEvent: { note: "" },
        isEditing: false,
        showFormError: false,
        shortcut: "none"
      };
    default:
      return state;
  }
}
