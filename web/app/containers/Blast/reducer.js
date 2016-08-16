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
  CHANGE_NAME,
  RESET,
  SUBMIT,
  SUBMIT_OK,
  SUBMIT_ERROR
} from './constants';

const initialState = fromJS({
    sequence: '',
    database: 'scaffold',
    tool: 'blastn',
    name: '',
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
        case CHANGE_NAME:
            return state.set('name',action.payload);
        case RESET:
            return initialState;
        case SUBMIT_OK:
            return state;
        case SUBMIT_ERROR:
            return state;
        default:
            return state;
    }
}

export default blastReducer;
