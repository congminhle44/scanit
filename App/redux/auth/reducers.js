import {
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_ERROR,
} from '../actionTypes';

const INIT_STATE = {
  loading: false,
  error: null,
  data: [],
  signInSuccess: false,
  logOutSuccess: false,
};
const auth = (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        signInSuccess: false,
        error: null,
      };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        signInSuccess: true,
      };
    case LOGIN_USER_ERROR:
      return {
        ...state,
        loading: false,
        signInSuccess: false,
        error: action.payload.data,
      };

    case LOGOUT_USER:
      return {
        ...state,
        loading: true,
        logOutSuccess: false,
        error: null,
      };
    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        logOutSuccess: true,
      };
    case LOGOUT_USER_ERROR:
      return {
        ...state,
        loading: false,
        logOutSuccess: false,
        error: action.payload.data,
      };

    default:
      return {...state};
  }
};
export default auth;
