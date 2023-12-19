import {LOGIN_USER, LOGOUT_USER} from '../actionTypes';

export function signIn(data) {
  return {
    type: LOGIN_USER,
    payload: data,
  };
}

export function logOut(data) {
  return {
    type: LOGOUT_USER,
    payload: data,
  };
}
