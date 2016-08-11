import { delay, takeLatest } from 'redux-saga';
import { fork, take, call, put, select, race } from 'redux-saga/effects';

import {
    FETCH_REPORT,
    FETCH_REPORT_OK,
    FETCH_REPORT_ERROR,
} from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';

// Fetch data every 20 seconds                                           
function* fetchReportData() {  
    console.debug("In fetchReportData");
    try {
        let i = 0;
        while (true) {
            //Delay the initial fetch by 20s.
            yield call(delay, 20000);
            //yield put(dataFetch());
            console.debug("Fetching report after delay");
            //Stop trying to fetch if it is futile.
            if (i > 1) {
                break;
            }
            i++;
        } 
    } catch (error) {
        return;
    }
    console.debug("Exiting fetchReportData");
    return;
}

// Wait for successful response, then fire another request
// Cancel polling if user logs out                                         
function* watchResultReport() {  

    while (true) {             
        console.debug("Waiting for FETCH_REPORT event");
        yield take(FETCH_REPORT);

        //Start to fetch the report and cancel if user changes page.
        yield race([
            call(fetchReportData),
            //call(fetchReportData),
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
