/*
 *
 * Main reducer
 *
 */
import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION
} from './constants';

import {
    SUBMIT_OK,
} from '../Blast/constants';

const initialState = fromJS({
    results: {
        blast: [],
        blat: []
    }
});

function mainReducer(state = initialState, action) {
    console.debug("mainReducer called with");
    console.debug(action.type);
    switch (action.type) {
    case DEFAULT_ACTION:
        return state;
    case SUBMIT_OK:
        return state.updateIn(['results', 'blast'], list => list.push(action.payload));
    default:
        return state;
    }
}

export default mainReducer;
