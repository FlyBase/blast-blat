/*
 *
 * Results reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
} from './constants';

const initialState = fromJS({});

function resultsReducer(state = initialState, action) {
    console.debug("resultsReducer called with");
    console.debug(action.type);
    switch (action.type) {
    case DEFAULT_ACTION:
        return state;
    default:
        return state;
    }
}

export default resultsReducer;
