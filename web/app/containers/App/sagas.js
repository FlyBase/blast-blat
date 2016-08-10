import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';

import { LOCATION_CHANGE, push } from 'react-router-redux';
import {
    LOAD_RESULTS,
    LOAD_RESULTS_OK,
    LOAD_RESULTS_ERROR,
    DELETE_RESULT,
    DELETE_RESULT_REMOTE,
    DELETE_RESULT_LOCAL,
} from './constants';

import {
    loadResultsOk,
    loadResultsError,
    deleteResultRemote,
    deleteResultLocal,
} from 'containers/App/actions';

import { selectResults } from 'containers/App/selectors';
import * as Api from 'utils/Api'

export function* getResults() {
    const resp = yield call(Api.fetchResults);

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

export function* getResultListWatcher() {
    console.debug("getResultListWatcher started");
    while (true) {
        console.debug("Starting background result list sync.");
        yield takeLatest(LOAD_RESULTS, getResults);
    }
}

export function* resultListData() {
    console.debug("resultListData forking watcher");
    const watcher = yield fork(getResultListWatcher);
}

export function* deleteResult(action) {
    //Call the local and remote delete actions in parallel.
    yield [
        call(Api.deleteResult,action.payload.id),
        put(deleteResultLocal(action.payload.id, action.payload.tool))
    ];
}

export function* deleteResultWatcher() {
    yield* takeLatest(DELETE_RESULT, deleteResult);
}

export default [
    resultListData,
    deleteResultWatcher,
];

