import { take, call, put, select, fork } from 'redux-saga/effects';

import { LOCATION_CHANGE } from 'react-router-redux';
import { SUBMIT, SUBMIT_OK, SUBMIT_ERR } from 'containers/Blast/constants';
import { blastSubmitted, blastSubmissionError } from 'containers/Blast/actions';

import { selectBlastForApi } from 'containers/Blast/selectors';

import request from 'utils/Api'

export function* submitBlast() {
    const blast = yield select(selectBlastForApi());
    const url   = '/api/blast/submit/' + blast.tool;

    const resp = yield call(request, url, blast);

    if (!resp.error) {
        blast.jobid = resp.data.resultset.result[0].jobid;
        blast.status = "pending";
        yield put(blastSubmitted(blast));
    }
    else {
        yield put(blastSumissionError(resp.error));
    }
}

export function* getBlastWatcher() {
    while (yield take(SUBMIT)) {
        yield call(submitBlast);
    }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* rootSaga() {
    yield fork(getBlastWatcher);
}

export default [
    rootSaga,
];

