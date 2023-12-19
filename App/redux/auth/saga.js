import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_ERROR,
  LOGOUT_USER_SUCCESS,
} from '../actionTypes';

import axiosConfig from '../../Helper/AxiosConfig';
import {API} from '../../Helper/HttpService';

function requestApi(type, url, params, headers) {
  return axiosConfig.request({
    method: type,
    url: url,
    data: params,
    headers: headers,
  });
}

function* signIn(action) {
  try {
    var postData = action.payload;
    let response = yield call(requestApi, 'POST', API.LOGIN_USER, postData);
    yield put({
      type: LOGIN_USER_SUCCESS,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: LOGIN_USER_ERROR,
      payload: err,
    });
  }
}

function* signInSaga() {
  yield takeLatest(LOGIN_USER, signIn);
}

function* logOut(action) {
  try {
    let response = yield call(requestApi, 'POST', API.LOGOUT_USER);
    yield put({
      type: LOGOUT_USER_SUCCESS,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: LOGOUT_USER_ERROR,
      payload: err,
    });
  }
}

function* logOutSaga() {
  yield takeLatest(LOGOUT_USER, logOut);
}

export default function* rootSigninSaga() {
  yield all([signInSaga()]);
  yield all([logOutSaga()]);
}
