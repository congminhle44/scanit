// const BASE_URL = 'https://schooltrunk.librisdev.com/sys/';
const BASE_URL = 'https://www.schooltrunk.org/sys/';

var BASE_URL_PHOTOGHOST = BASE_URL + 'scanit/';
var BASE_URL_PASSWORD = BASE_URL + 'password/';

export const API = {
  BASE_URL: BASE_URL_PHOTOGHOST,
  LOGIN_USER: BASE_URL_PHOTOGHOST + 'login',
  LOGOUT_USER: BASE_URL_PHOTOGHOST + 'logout',

  FETCH_SCHOOL: BASE_URL_PHOTOGHOST + 'schoollist',
  DETAILS_SCHOOL: BASE_URL_PHOTOGHOST + 'defaultlocations',
  FETCH_HOUSE: BASE_URL_PHOTOGHOST + 'houselist',
  LOCATION_lIST: BASE_URL_PHOTOGHOST + 'locationlist',
  NAME_LIST: BASE_URL_PHOTOGHOST + 'namelist',

  BARCODE_SCAN_LABEL: BASE_URL_PHOTOGHOST + 'scanlabel',
  STORAGE_CREATE: BASE_URL_PHOTOGHOST + 'addstorage',
  REPORT_STATUS: BASE_URL_PHOTOGHOST + 'stats',
  UPLOAD_IMAGES: BASE_URL_PHOTOGHOST + 'upload',
  LOGOUT: BASE_URL_PHOTOGHOST + 'logout',
  SAVE_MORE: BASE_URL_PHOTOGHOST + 'savemove',
};
