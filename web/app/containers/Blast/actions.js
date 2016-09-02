/*
 *
 * Blast actions
 *
 */

import {
  CHANGE_SEQUENCE,
  CHANGE_DATABASE,
  CHANGE_TOOL,
  CHANGE_NAME,
  CHANGE_EVALUE,
  ADD_SPECIES,
  REMOVE_SPECIES,
  RESET,
  SUBMIT,
  SUBMIT_OK,
  SUBMIT_ERROR
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

export function changeName(name) {
    return {
        type: CHANGE_NAME,
        payload: name
    };
}

export function changeEvalue(evalue) {
    return {
        type: CHANGE_EVALUE,
        payload: evalue
    };
}

export function addSpecies(species) {
    return {
        type: ADD_SPECIES,
        payload: species
    };
}

export function removeSpecies(species) {
    return {
        type: REMOVE_SPECIES,
        payload: species
    };
}

export function reset() {
    return {
        type: RESET
    };
}

export function submitBlast() {
    return { type: SUBMIT };
}

export function blastSubmissionOk(job) {
    return { type: SUBMIT_OK, payload: job};
}

export function blastSubmissionError(response) {
    return { type: SUBMIT_ERR, payload: response };
}
