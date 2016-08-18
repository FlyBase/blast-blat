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

export function fetchReport(jobid) {
    return {
        type: FETCH_REPORT,
        payload: jobid
    };
}

export function fetchReportOk(job) {
    return {
        type: FETCH_REPORT_OK,
        payload: job
    };
}

export function fetchReportError(error) {
    return {
        type: FETCH_REPORT_ERROR,
        payload: error
    };
}
