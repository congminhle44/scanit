import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import reducers from './rootReducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export function configureStore() {
  const store = createStore(reducers, applyMiddleware(sagaMiddleware, logger));

  sagaMiddleware.run(rootSaga);

  return store;
}
