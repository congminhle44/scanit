import {
  FETCH_SCHOOLDETAIL_ERROR,
  FETCH_SCHOOLDETAIL_REQUEST,
  FETCH_SCHOOLDETAIL_SUCCESS,
  CLEAR_SCHOOLDETAIL_REQUEST,
  FETCH_SCHOOLLIST_ERROR,
  FETCH_SCHOOLLIST_REQUEST,
  FETCH_SCHOOLLIST_SUCCESS,
  CLEAR_SCHOOLLIST_REQUEST,
  FETCH_HOUSELIST_REQUEST,
  FETCH_HOUSELIST_SUCCESS,
  FETCH_HOUSELIST_ERROR,
  BARODE_SCANLABEL_REQUEST,
  BARODE_SCANLABEL_SUCCESS,
  BARODE_SCANLABEL_ERROR,
  STORAGE_CREATE_REQUEST,
  STORAGE_CREATE_SUCCESS,
  STORAGE_CREATE_ERROR,
  CLEAR_BARODE_SCANLABEL,
  CLEAR_STORAGE_CREATE,
  GET_REPORT_STATUS_REQUEST,
  GET_REPORT_STATUS_SUCCESS,
  GET_REPORT_STATUS_ERROR,
  CLEAR_GET_REPORT_STATUS_,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_ERROR,
  CLEAR_UPLOAD_IMAGES,
  LOCATION_LIST_REQUEST,
  LOCATION_LIST_SUCCESS,
  LOCATION_LIST_ERROR,
  CLEAR_LOCATION_LIST,
  NAME_LIST_REQUEST,
  NAME_LIST_SUCCESS,
  NAME_LIST_ERROR,
  CLEAR_NAME_LIST,
} from '../actionTypes';

const INIT_STATE = {
  loading: false,
  error: null,
  data: [],
  houseList: [],
  Schooldetail: [],
  barcodeScanData: [],
  storageCreate: {},
  reportData: [],
  uploadImage: {},
  locationList: [],
  nameList: [],
  signInSuccess: false,
};
const nonAuth = (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_SCHOOLLIST_REQUEST:
      return {
        ...state,
        loading: true,
        signInSuccess: false,
        error: null,
      };
    case FETCH_SCHOOLLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        signInSuccess: true,
      };
    case FETCH_SCHOOLLIST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.data,
      };
    case CLEAR_SCHOOLLIST_REQUEST:
      return {
        ...state,
        loading: false,
        data: [],
        signInSuccess: true,
      };

    case FETCH_SCHOOLDETAIL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_SCHOOLDETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        Schooldetail: action.payload.data,
      };
    case FETCH_SCHOOLDETAIL_ERROR:
      return {
        ...state,
        error: action.payload.data,
      };
    case CLEAR_SCHOOLDETAIL_REQUEST:
      return {
        ...state,
        loading: false,
        Schooldetail: [],
      };

    case FETCH_HOUSELIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_HOUSELIST_SUCCESS:
      return {
        ...state,
        loading: false,
        houseList: action.payload.data,
      };
    case FETCH_HOUSELIST_ERROR:
      return {
        ...state,
        error: action.payload.data,
      };

    case BARODE_SCANLABEL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case BARODE_SCANLABEL_SUCCESS:
      return {
        ...state,
        loading: false,
        barcodeScanData: action.payload,
      };
    case BARODE_SCANLABEL_ERROR:
      return {
        ...state,
        error: action.payload.data,
      };

    case CLEAR_BARODE_SCANLABEL:
      return {
        ...state,
        loading: false,
        barcodeScanData: [],
        error: [],
      };

    case STORAGE_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
        storageCreate: false,
        error: null,
      };
    case STORAGE_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        storageCreate: action.payload.data,
      };
    case STORAGE_CREATE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.data,
      };

    case CLEAR_STORAGE_CREATE:
      return {
        ...state,
        loading: false,
        storageCreate: [],
        error: null,
      };

    case GET_REPORT_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_REPORT_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        reportData: action.payload.data,
      };
    case GET_REPORT_STATUS_ERROR:
      return {
        ...state,
        error: action.payload.data,
      };

    case CLEAR_GET_REPORT_STATUS_:
      return {
        ...state,
        loading: false,
        uploadImage: [],
        error: [],
      };

    case UPLOAD_IMAGES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPLOAD_IMAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        uploadImage: action.payload.data,
      };
    case UPLOAD_IMAGES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.data,
      };

    case CLEAR_UPLOAD_IMAGES:
      return {
        ...state,
        loading: false,
        locationList: [],
        error: [],
      };

    case LOCATION_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LOCATION_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        locationList: action.payload.data,
      };
    case LOCATION_LIST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.data,
      };

    case CLEAR_LOCATION_LIST:
      return {
        ...state,
        loading: false,
        locationList: [],
        error: [],
      };

    case NAME_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NAME_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        nameList: action.payload.data,
      };
    case NAME_LIST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.data,
      };

    case CLEAR_NAME_LIST:
      return {
        ...state,
        loading: false,
        nameList: [],
        error: [],
      };

    default:
      return {...state};
  }
};
export default nonAuth;
