import {
  GET_FILES,
  SET_SHEET,
  UNAUTH_USER,
  GET_SHEET_META,
  SHEET_DIALOG_OPEN,
  SHEET_DIALOG_CLOSE,
  CREATE_SHEET_NAME,
  CREATE_SHEET
} from "../actions/types.js";

const initialState = {
  sheets: [],
  selectedSheet: "",
  sheetInfo: null,
  sheetValues: null,
  showSheetDialog: false,
  newSheetName: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_FILES:
      const lastUsedSheet = action.payload.sheets.filter(
        sheet => sheet.id === action.payload.lastUsed
      );
      return {
        ...state,
        sheets: [...action.payload.sheets],
        selectedSheet: lastUsedSheet.length === 0 ? null : lastUsedSheet[0],
        prefix:
          lastUsedSheet.length > 0
            ? lastUsedSheet[0].name.substring(12) + ": "
            : null
      };
    case CREATE_SHEET:
      return { ...state, sheets: [...state.sheets, action.payload] };
    case UNAUTH_USER:
      return initialState;
    case SET_SHEET:
      return {
        ...state,
        selectedSheet: action.payload,
        prefix: action.payload.name.substring(12) + ": "
      };
    case GET_SHEET_META:
      return { ...state, sheetValues: action.payload };
    case SHEET_DIALOG_OPEN:
      return { ...state, showSheetDialog: true };
    case SHEET_DIALOG_CLOSE:
      return { ...state, showSheetDialog: false, newSheetName: "" };
    case CREATE_SHEET_NAME:
      return { ...state, newSheetName: action.payload };
    default:
      return state;
  }
}
