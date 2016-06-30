/*
 *
 * Blast reducer
 *
 */

import { fromJS } from 'immutable';

import {
  CHANGE_SEQUENCE,
  CHANGE_DATABASE,
  CHANGE_TOOL,
  SUBMIT,
  SUBMIT_OK,
  SUBMIT_ERR
} from './constants';

const initialState = fromJS({
    sequence: '',
    database: 'scaffold',
    tool: 'blastn'
});

function blastReducer(state = initialState, action) {
    console.debug("blastReducer called with:");
    console.debug(action.type);
    switch (action.type) {
    case CHANGE_SEQUENCE:
        return state.set('sequence',action.payload);
    case CHANGE_DATABASE:
        return state.set('database',action.payload);
    case CHANGE_TOOL:
        return state.set('tool',action.payload);
    case SUBMIT_OK:
        return state;
    case SUBMIT_ERR:
        return state;
    default:
        return state;
    }
}

export default blastReducer;
