import {combineReducers} from 'redux';
import auth from './auth/reducers';
import nonAuth from './nonAuth/reducers';

const reducers = combineReducers({
  auth,
  nonAuth,
});

export default reducers;
