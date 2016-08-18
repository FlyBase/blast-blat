/*
 *
 * ResultReport reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  FETCH_REPORT,
  FETCH_REPORT_OK,
  FETCH_REPORT_ERROR
} from './constants';

const initialState = fromJS({
    isReady: false,
    job: null,
    id: null
});

function resultItemReducer(state = initialState, action) {
    switch (action.type) {
        case DEFAULT_ACTION:
            return state;
        case FETCH_REPORT:
            return state.merge({id: action.payload, job: null, isReady: false});
        case FETCH_REPORT_OK:
            return state.merge({job : action.payload, isReady: true});
        default:
            return state;
    }
}

export default resultItemReducer;
