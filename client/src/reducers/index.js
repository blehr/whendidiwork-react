import { combineReducers } from "redux";
import AuthReducer from "./auth-reducer";
import CalendarList from "./calendar-reducer";
import SheetReducer from "./sheet-reducer";
import EventReducer from "./event-reducer";

const rootReducer = combineReducers({
  auth: AuthReducer,
  calendar: CalendarList,
  sheet: SheetReducer,
  event: EventReducer
});

export default rootReducer;
