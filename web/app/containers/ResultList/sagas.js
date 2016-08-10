import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork } from 'redux-saga/effects';

import { push } from 'react-router-redux';
import { LOAD_RESULTS, LOAD_RESULTS_OK, LOAD_RESULTS_ERROR, DELETE_RESULT } from 'containers/App/constants';
import { loadResultsOk, loadResultsError } from 'containers/App/actions';

import { selectResults } from 'containers/App/selectors';
import { fetchResults, deleteResult } from 'utils/Api'

export function* getResults() {
    const resp = yield call(fetchResults);

    if (!resp.error) {
        console.debug(resp);
        //Read in the array of results.
        let results = {
            blast: [],
            blat: []
        };
        for (let result of resp.data.resultset.result) {
            if (result.tool === 'blat') {
                results.blat.push(result);
            }
            else {
                results.blast.push(result);
            }
        }
        yield put(loadResultsOk(results));
    }
    else {
        yield put(loadResultsError(resp.error));
    }
}

export function* deleteRemoteResult(action) {
    yield fork(deleteResult,action.payload.id);
}

export function* resultSaga() {
    yield* takeLatest(LOAD_RESULTS, getResults);
}

export function* deleteResultSaga() {
    yield* takeLatest(DELETE_RESULT, deleteRemoteResult);
}

export default [
    resultSaga,
    deleteResultSaga
];

