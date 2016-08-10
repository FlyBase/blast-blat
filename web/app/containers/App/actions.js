/*
 *
 * App actions
 *
 */

import {
    LOAD_RESULTS,
    LOAD_RESULTS_OK,
    LOAD_RESULTS_ERROR,
    DELETE_RESULT,
    DELETE_RESULT_REMOTE,
    DELETE_RESULT_LOCAL,
} from './constants';

export function loadResults() {
    console.debug("Load results issued");
    return {
        type: LOAD_RESULTS
    };
}

export function loadResultsOk(results) {
    return {
        type: LOAD_RESULTS_OK,
        payload: results
    };
}

export function loadResultsError(err) {
    return {
        type: LOAD_RESULTS_ERROR,
        payload: err
    };
}

export function deleteResult(id, tool) {
    return {
        type: DELETE_RESULT,
        payload: { id, tool }
    };
}

export function deleteResultRemote(id, tool) {
    return {
        type: DELETE_RESULT_REMOTE,
        payload: { id, tool }
    };
}

export function deleteResultLocal(id, tool) {
    return {
        type: DELETE_RESULT_LOCAL,
        payload: { id, tool }
    };
}
