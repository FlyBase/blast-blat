/*
 *
 * ResultReport actions
 *
 */

import {
    DEFAULT_ACTION,
    FETCH_REPORT,
    FETCH_REPORT_OK,
    FETCH_REPORT_ERROR
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function fetchReport() {
    return {
        type: FETCH_REPORT,
    };
}

export function fetchReportOk() {
    return {
        type: FETCH_REPORT_OK,
    };
}

export function fetchReportError() {
    return {
        type: FETCH_REPORT_ERROR,
    };
}
