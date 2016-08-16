import { takeEvery } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';

import { LOCATION_CHANGE, push } from 'react-router-redux';
import { SUBMIT } from 'containers/Blast/constants';
import { blastSubmissionOk, blastSubmissionError } from 'containers/Blast/actions';
import { loadResults } from 'containers/App/actions';

import { selectBlastForApi } from 'containers/Blast/selectors';

import { request } from 'utils/Api'

export function* submitBlast() {
    const blast = yield select(selectBlastForApi());
    const url   = '/api/blast/submit/' + blast.tool;

    console.debug("Sending off BLAST job");
    const resp = yield call(request, url, blast);

    if (!resp.error) {
        blast.jobid = resp.data.resultset.result[0].jobid;
        blast.status = "pending";
        yield put(blastSubmissionOk(blast));
        yield put(loadResults());
        yield put(push('/results/' + blast.jobid));
    }
    else {
        yield put(blastSumissionError(resp.error));
    }
}

export function* getBlastWatcher() {
    while (true) {
        yield takeEvery(SUBMIT,submitBlast);
    }
}

export function* blastSaga() {
    const watcher = yield fork(getBlastWatcher);

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

    // If user leaves the BLAST page, cancel the watcher/saga.
    yield take(LOCATION_CHANGE);
    yield cancel(watcher);
}

export default [
    blastSaga
];

