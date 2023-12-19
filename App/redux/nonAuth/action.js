import {
  FETCH_SCHOOLLIST_REQUEST,
  FETCH_SCHOOLDETAIL_REQUEST,
  FETCH_HOUSELIST_REQUEST,
  BARODE_SCANLABEL_REQUEST,
  STORAGE_CREATE_REQUEST,
  CLEAR_BARODE_SCANLABEL,
  CLEAR_STORAGE_CREATE,
  GET_REPORT_STATUS_REQUEST,
  CLEAR_GET_REPORT_STATUS_,
  UPLOAD_IMAGES_REQUEST,
  CLEAR_UPLOAD_IMAGES,
  LOCATION_LIST_REQUEST,
  CLEAR_LOCATION_LIST,
  NAME_LIST_REQUEST,
  CLEAR_NAME_LIST,
  CLEAR_SCHOOLLIST_REQUEST,
  CLEAR_SCHOOLDETAIL_REQUEST,
} from '../actionTypes';

export function FetchSchoollist(data) {
  return {
    type: FETCH_SCHOOLLIST_REQUEST,
    payload: data,
  };
}

export function ClearSchoollist(data) {
  return {
    type: CLEAR_SCHOOLLIST_REQUEST,
    payload: data,
  };
}

export function FetchSchooldetail(data) {
  return {
    type: FETCH_SCHOOLDETAIL_REQUEST,
    payload: data,
  };
}

export function ClearSchoolDetails(data) {
  return {
    type: CLEAR_SCHOOLDETAIL_REQUEST,
    payload: data,
  };
}

export function FetchHouseList(data) {
  return {
    type: FETCH_HOUSELIST_REQUEST,
    payload: data,
  };
}

export function barCodeScaner(data) {
  return {
    type: BARODE_SCANLABEL_REQUEST,
    payload: data,
  };
}

export function clearBarCodeScanner(data) {
  return {
    type: CLEAR_BARODE_SCANLABEL,
    payload: data,
  };
}

export function addStorage(data) {
  return {
    type: STORAGE_CREATE_REQUEST,
    payload: data,
  };
}

export function clearaddStorage(data) {
  return {
    type: CLEAR_STORAGE_CREATE,
    payload: data,
  };
}

export function getReport(data) {
  return {
    type: GET_REPORT_STATUS_REQUEST,
    payload: data,
  };
}

export function cleargetReport(data) {
  return {
    type: CLEAR_GET_REPORT_STATUS_,
    payload: data,
  };
}

export function uploadImages(data) {
  return {
    type: UPLOAD_IMAGES_REQUEST,
    payload: data,
  };
}

export function clearUploadImages(data) {
  return {
    type: CLEAR_UPLOAD_IMAGES,
    payload: data,
  };
}

export function getLocationList(data) {
  return {
    type: LOCATION_LIST_REQUEST,
    payload: data,
  };
}

export function clearGetLocationList(data) {
  return {
    type: CLEAR_LOCATION_LIST,
    payload: data,
  };
}

export function getNameList(data) {
  return {
    type: NAME_LIST_REQUEST,
    payload: data,
  };
}

export function clearGetNameList(data) {
  return {
    type: CLEAR_NAME_LIST,
    payload: data,
  };
}
