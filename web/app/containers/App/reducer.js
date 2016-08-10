/*
 *
 * App reducer
 *
 */
import { fromJS, toObject } from 'immutable';

import {
    LOAD_RESULTS,
    LOAD_RESULTS_OK,
    LOAD_RESULTS_ERROR,
    DELETE_RESULT,
    DELETE_RESULT_REMOTE,
    DELETE_RESULT_LOCAL,
} from './constants';

import {
    SUBMIT_OK as BLAST_SUBMIT_OK,
} from '../Blast/constants';

const initialState = fromJS({
    results: {
        blast: [],
        blat: []
    }
});

function appReducer(state = initialState, action) {
    switch (action.type) {
    case BLAST_SUBMIT_OK:
        //console.debug("Adding result ID to result list.");
        //return state.updateIn(['results', 'blast'], list => list.push(action.payload.jobid));
        return state;
    case LOAD_RESULTS_OK:
        console.debug("Got results from server");
        return state.set('results', fromJS(action.payload));
    case DELETE_RESULT_LOCAL:
        console.debug("Deleted " + action.payload.id);
        //This deletes the corresponding job id from the corresponding result list.
        //The call to updateIn pulls from the state object at state.results.blast and returns a list.
        //The ES6 function then iterates over the list and removes entries that have the same job ID.
        return state.updateIn(['results',action.payload.tool], (results) => {
            return results.filterNot(result => result.get('jobid') === action.payload.id);
        });
    default:
        return state;
    }
}

export default appReducer;
