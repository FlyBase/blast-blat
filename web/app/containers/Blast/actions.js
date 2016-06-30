/*
 *
 * Blast actions
 *
 */

import {
  CHANGE_SEQUENCE,
  CHANGE_DATABASE,
  CHANGE_TOOL,
  SUBMIT,
  SUBMIT_OK,
  SUBMIT_ERR
} from './constants';

export function changeSequence(sequence) {
    return {
        type: CHANGE_SEQUENCE,
        payload: sequence
    };
}

export function changeDatabase(db) {
    return {
        type: CHANGE_DATABASE,
        payload: db
    };
}

export function changeTool(tool) {
    return {
        type: CHANGE_TOOL,
        payload: tool
    };
}

export function submitBlast() {
    return { type: SUBMIT };
}

export function blastSubmitted(job) {
    console.debug(job);
    return { type: SUBMIT_OK, payload: job};
}

export function blastSubmissionError(response) {
    return { type: SUBMIT_ERR, payload: response };
}
