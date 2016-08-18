import { delay } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { loadResults } from 'containers/App/actions';

export function* getResultListWatcher() {
    let delayTime = 20000;

    while (true) {
        //Reload the result list then delay for a bit.
        yield put(loadResults());
        yield call(delay, delayTime);
    }
}

export function* resultListSaga() {
    const watcher = yield fork(getResultListWatcher);

    /**
     * IMPORTANT!!!
     *
     * You must use this pattern of 
     *
     * const watcher = yield fork(topLevelWatcher);
     *
     * yield take(LOCATION_CHANGE);
     * yield cancel(watcher);
     *
     * The pattern used in this saga is critical.  Sagas are 
     * injected into the container when the container is loaded by
     * the router.  If you do not cancel a loader when the user
     * changes the page, multiple copies of the saga will be injected
     * and run.  The one exception is the top level App saga,
     * which is added when the application is loaded.
     *
     */

    // If user leaves the ResultList page, cancel the watcher/saga.
    yield take(LOCATION_CHANGE);
    yield cancel(watcher);

}

export default [
    resultListSaga
];

