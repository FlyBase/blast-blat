import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork } from 'redux-saga/effects';

import { push } from 'react-router-redux';
import { SUBMIT } from 'containers/Blast/constants';
import { blastSubmissionOk, blastSubmissionError } from 'containers/Blast/actions';
import { loadResults } from 'containers/App/actions';

import { selectBlastForApi } from 'containers/Blast/selectors';

import { request } from 'utils/Api'

export function* submitBlast() {
    const blast = yield select(selectBlastForApi());
    const url   = '/api/blast/submit/' + blast.tool;

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

export function* blastSaga() {
    yield* takeLatest(SUBMIT, submitBlast);
}

export default [
    blastSaga
];

