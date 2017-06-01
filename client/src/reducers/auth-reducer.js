import {
  AUTH_USER,
  UNAUTH_USER,
  GET_USER
} from '../actions/types.js';

const initialState = {
  auth: false,
  id: null,
  name: null,
  profileImg: null
}


export default function(state = initialState, action) {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, auth: true, id: action.payload };
    case UNAUTH_USER:
      return initialState;
    case GET_USER:
      return { ...state, name: action.payload.google.displayName, profileImg: action.payload.google.profileImg };
    default:
      return state;
  }
}