import { delay, takeLatest } from 'redux-saga';
import { fork, take, call, put, select, race } from 'redux-saga/effects';

import {
    FETCH_REPORT,
    FETCH_REPORT_OK,
    FETCH_REPORT_ERROR,
} from './constants';

import {
    CREATED,
    WORKING,
    COMPLETED,
    FAILED
} from 'containers/App/constants';

import { fetchReportOk, fetchReportError } from './actions';

import { LOCATION_CHANGE } from 'react-router-redux';

import { fetchReport } from 'utils/Api';

// Fetch data every 20 seconds                                           
function* fetchReportData(id) {  
    console.debug("In fetchReportData");

    try {
        let i = 0;
        while (true) {
            console.debug("Calling fetchReport API");
            const resp = yield call(fetchReport, id);

            if (!resp.error) {
                const job = resp.data.resultset.result[0];
                if (job.status === COMPLETED || job.status === FAILED) {
                    console.debug("Job looks OK");
                    yield put(fetchReportOk(job));
                    break;
                }
                else {
                    console.debug("Job still running....");
                }
            }
            else {
                console.debug("Job isn't OK.");
                yield put(fetchReportError(resp.error));
            }

            yield call(delay, 20000); // Delay next fetch by 20s.

            // Stop trying to fetch if it is futile.
            if (i > 30) {
                break;
            }
            i++;
        } 
    } catch (error) {
        console.error(error);
    }
    console.debug("Exiting fetchReportData");
}

// Wait for successful response, then fire another request
// Cancel polling if user logs out 
function* watchResultReport() {  
    while (true) {             
        console.debug("Waiting for FETCH_REPORT event");
        const action = yield take(FETCH_REPORT);

        // Start to fetch the report and cancel if user changes page.
        yield race([
            call(fetchReportData,action.payload),
            take(LOCATION_CHANGE)
        ]);
    }
}

// Daemonize tasks in parallel                       
function* root() {  
    yield [
        fork(watchResultReport)
        // other watchers here
    ];
}

export default [
    root
];
