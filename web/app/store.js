/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';

import { getAsyncInjectors } from 'utils/asyncInjectors';
import globalSagas from './sagas';

import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';
import debounce from 'redux-storage-decorator-debounce';
import filter from 'redux-storage-decorator-immutable-filter';

let engine = createEngine('blast-blat-state');

// Filter out the store keys that reference immutable objects.
engine       = filter(engine,
                      ['global','blast'],    // Only worry about these store keys.
                      [ 'route', 'language'] // Ignore these.
                     );
engine     = debounce(engine, 1500);                      // Queue up save operations so we don't crippled the app.

const localStorageMiddleware = storage.createMiddleware(engine);
const sagaMiddleware = createSagaMiddleware();
const devtools = window.devToolsExtension || (() => noop => noop);

export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
    sagaMiddleware,
    localStorageMiddleware,
    routerMiddleware(history),
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
    devtools(),
  ];

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    compose(...enhancers)
  );
  console.debug("Store created");
  const load = storage.createLoader(engine);
  load(store).then((newState) => {
      console.debug("Loaded state");
      console.debug(store.getState());
      console.debug(newState);
  })
  .catch(() => {
      console.error("Failed to load previous state");
  });

  // Create hook for async sagas
  store.runSaga = sagaMiddleware.run;
  store.asyncReducers = {}; // Async reducer registry


  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    System.import('./reducers').then((reducerModule) => {
      const createReducers = reducerModule.default;
      const nextReducers = createReducers(store.asyncReducers);

      store.replaceReducer(nextReducers);
    });
  }

  
  //Inject global sagas into application.
  const { injectSagas } = getAsyncInjectors(store);
  injectSagas(...globalSagas);

  return store;
}
