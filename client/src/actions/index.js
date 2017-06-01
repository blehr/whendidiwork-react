import axios from "axios";

import {
  AUTH_USER,
  UNAUTH_USER,
  GET_USER
} from './types.js';

const rootURL = "http://localhost:8081";

export const authUser = (id) => {
  return {
    type: AUTH_USER,
    payload: id
  }
}

export const unauthUser = () => {
  return dispatch => {
    axios.get(`${rootURL}/auth/logout`)
      .then(response => {
        console.log(response);
        dispatch({
          type: UNAUTH_USER
        })
      })
      .catch(err => console.log(err));
  }
}

export const getUser = (id) => {
  if (id == null) {
    return {
      type: UNAUTH_USER
    }
  };
  return dispatch => {
    axios.get(`${rootURL}/auth/user`)
    .then(response => {
      dispatch({
        type: GET_USER,
        payload: response.data
      })
    })
    .catch(err => console.log(err));
  }
}

