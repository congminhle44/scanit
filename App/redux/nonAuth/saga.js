import {Alert, AlertIOS, Platform, ToastAndroid} from 'react-native';
import {all, call, put, takeLatest} from 'redux-saga/effects';
import axiosConfig from '../../Helper/AxiosConfig';
import {API} from '../../Helper/HttpService';

import {
  BARODE_SCANLABEL_ERROR,
  BARODE_SCANLABEL_REQUEST,
  BARODE_SCANLABEL_SUCCESS,
  FETCH_HOUSELIST_ERROR,
  FETCH_HOUSELIST_REQUEST,
  FETCH_HOUSELIST_SUCCESS,
  FETCH_SCHOOLDETAIL_ERROR,
  FETCH_SCHOOLDETAIL_REQUEST,
  FETCH_SCHOOLDETAIL_SUCCESS,
  FETCH_SCHOOLLIST_ERROR,
  FETCH_SCHOOLLIST_REQUEST,
  FETCH_SCHOOLLIST_SUCCESS,
  GET_REPORT_STATUS_ERROR,
  GET_REPORT_STATUS_REQUEST,
  GET_REPORT_STATUS_SUCCESS,
  LOCATION_LIST_ERROR,
  LOCATION_LIST_REQUEST,
  LOCATION_LIST_SUCCESS,
  NAME_LIST_ERROR,
  NAME_LIST_REQUEST,
  NAME_LIST_SUCCESS,
  STORAGE_CREATE_ERROR,
  STORAGE_CREATE_REQUEST,
  STORAGE_CREATE_SUCCESS,
  UPLOAD_IMAGES_ERROR,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
} from '../actionTypes';

function requestApi(type, url, params, headers) {
  return axiosConfig.request({
    method: type,
    url: url,
    data: params,
    headers: headers,
  });
}

function* fetchSchool() {
  try {
    let response = yield call(requestApi, 'GET', API.FETCH_SCHOOL);
    yield put({
      type: FETCH_SCHOOLLIST_SUCCESS,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: FETCH_SCHOOLLIST_ERROR,
      payload: err,
    });
  }
}

function* fetchSchoolSaga() {
  yield takeLatest(FETCH_SCHOOLLIST_REQUEST, fetchSchool);
}

function* fetchSchooldetail(action) {
  try {
    let response = yield call(
      requestApi,
      'GET',
      API.DETAILS_SCHOOL + action.payload,
    );
    yield put({
      type: FETCH_SCHOOLDETAIL_SUCCESS,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: FETCH_SCHOOLDETAIL_ERROR,
      payload: err,
    });
  }
}

function* fetchSchoolDetailSaga() {
  yield takeLatest(FETCH_SCHOOLDETAIL_REQUEST, fetchSchooldetail);
}

function* fetchHouselist(action) {
  try {
    let response = yield call(
      requestApi,
      'GET',
      API.FETCH_HOUSE + action.payload,
    );
    yield put({
      type: FETCH_HOUSELIST_SUCCESS,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: FETCH_HOUSELIST_ERROR,
      payload: err,
    });
  }
}

function* fetchHouselistSaga() {
  yield takeLatest(FETCH_HOUSELIST_REQUEST, fetchHouselist);
}

function* barCodeScanning(action) {
  try {
    let response = yield call(
      requestApi,
      'POST',
      API.BARCODE_SCAN_LABEL,
      action.payload,
      {'Content-Type': 'application/json'},
    );
    console.log('APIDATA==> ' + JSON.stringify(response));
    yield put({
      type: BARODE_SCANLABEL_SUCCESS,
      payload: response,
    });
  } catch (err) {
    console.log('error==> ' + JSON.stringify(err));
    yield put({
      type: BARODE_SCANLABEL_ERROR,
      payload: err,
    });
  }
}

function* barCodeScanningSaga() {
  yield takeLatest(BARODE_SCANLABEL_REQUEST, barCodeScanning);
}

function* addStorageData(action) {
  try {
    let response = yield call(
      requestApi,
      'POST',
      API.STORAGE_CREATE,
      action.payload,
      {'Content-Type': 'application/json'},
    );
    console.log('APIDATA==> ' + JSON.stringify(response));
    if (response?.data?.ret === 0) {
      Alert.alert('', 'Storage created.');
      yield put({
        type: STORAGE_CREATE_SUCCESS,
        payload: response,
      });
    } else if (response?.data?.ret === 1) {
      Alert.alert('', response?.data?.error);
    }
  } catch (err) {
    console.log('error==> ' + JSON.stringify(err));
    yield put({
      type: STORAGE_CREATE_ERROR,
      payload: err,
    });
  }
}

function* addStorageSaga() {
  yield takeLatest(STORAGE_CREATE_REQUEST, addStorageData);
}

function* getReportStatus(action) {
  try {
    let response = yield call(
      requestApi,
      'GET',
      API.REPORT_STATUS + action.payload,
    );
    yield put({
      type: GET_REPORT_STATUS_SUCCESS,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: GET_REPORT_STATUS_ERROR,
      payload: err,
    });
  }
}

function* getReportSaga() {
  yield takeLatest(GET_REPORT_STATUS_REQUEST, getReportStatus);
}

function* uploadImagesData(action) {
  console.log('ACTION==> ' + JSON.stringify(action));
  try {
    let response = yield call(
      requestApi,
      'POST',
      API.UPLOAD_IMAGES,
      action.payload,
      {'Content-Type': 'multipart/form-data'},
    );
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      payload: response,
    });
    console.log('response==> ' + JSON.stringify(response));
    response.status === 200
      ? Platform.OS === 'android'
        ? ToastAndroid.show(
            'Your file uploaded successfully',
            ToastAndroid.SHORT,
          )
        : AlertIOS.alert('Your file uploaded successfully')
      : null;
  } catch (err) {
    console.log('error==> ' + JSON.stringify(err));
    yield put({
      type: UPLOAD_IMAGES_ERROR,
      payload: err,
    });
  }
}

function* uploadImagesSaga() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImagesData);
}

function* getLocationListData(action) {
  try {
    let response = yield call(
      requestApi,
      'GET',
      API.LOCATION_lIST + action.payload,
    );
    yield put({
      type: LOCATION_LIST_SUCCESS,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: LOCATION_LIST_ERROR,
      payload: err,
    });
  }
}

function* fetchLocationListSaga() {
  yield takeLatest(LOCATION_LIST_REQUEST, getLocationListData);
}

function* fatchNameList(action) {
  try {
    let response = yield call(
      requestApi,
      'GET',
      API.NAME_LIST + action.payload,
    );
    console.log('response== > ' + JSON.stringify(response));
    yield put({
      type: NAME_LIST_SUCCESS,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: NAME_LIST_ERROR,
      payload: err,
    });
  }
}

function* fetchNameListSaga() {
  yield takeLatest(NAME_LIST_REQUEST, fatchNameList);
}

export default function* rootnonAuthSaga() {
  yield all([
    fetchSchoolSaga(),
    fetchSchoolDetailSaga(),
    fetchHouselistSaga(),
    barCodeScanningSaga(),
    addStorageSaga(),
    getReportSaga(),
    uploadImagesSaga(),
    fetchLocationListSaga(),
    fetchNameListSaga(),
  ]);
}
