import {all} from 'redux-saga/effects';
import authSagas from './auth/saga';
import nonAuth from './nonAuth/saga';

export default function* rootSaga() {
  yield all([authSagas(), nonAuth()]);
}
