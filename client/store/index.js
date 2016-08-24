import { createStore, applyMiddleware } from 'redux';

import { logger, socket } from '../middleware';
import rootReducer from '../reducers';
import io from 'socket.io-client';
import * as actions from '../actions/talks';

export default function configure(initialState) {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;

  const connection = io()
  const createStoreWithMiddleware = applyMiddleware(
    logger,
    socket(connection)
  )(create);

  const store = createStoreWithMiddleware(rootReducer, initialState);

  connection.on('response talks', data => {
    let action = Object.assign({}, actions.setTalks(), {
      payload: data
    });
    return store.dispatch(action);
  });
  connection.on('response info', data => {
    let action = Object.assign({}, actions.setInfo(), {
      payload: data
    });
    return store.dispatch(action);
  });

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
