import axios from 'axios';
import {API} from './HttpService';
axios.defaults.headers.post['Content-Type'] =
  'multipart/form-data; boundary=<calculated when request is sent>';
axios.defaults.headers.post['Accept'] = '*/*';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Access-Control-Allow-Methods'] =
  'GET,PUT,POST,PATCH,DELETE,OPTIONS';
axios.defaults.headers.post['Access-Control-Allow-Credentials'] = 'true';
axios.defaults.headers.post['Access-Control-Allow-Headers'] =
  'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization';
const instance = axios.create({
  baseURL: API.BASE_URL,
  timeout: 10000,
});
instance.interceptors.request.use(
  async config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log('error axios', error);
    return Promise.reject(error);
  },
);
export default instance;
