import { delay, fork, take, call, put, select } from 'redux-saga/effects';

import { SUBMIT_OK as BLAST_SUBMIT_OK } from 'containers/Blast/constants';
import { FETCH_REPORT_OK } from './constants';

// Fetch data every 20 seconds                                           
function* fetchReportData() {  
    try {
        yield call(delay, 20000);
        //yield put(dataFetch());
        console.debug("Fetching report after delay");
    } catch (error) {
        return;
    }
}

// Wait for successful response, then fire another request
// Cancel polling if user logs out                                         
function* watchResultReport() {  
    while (true) {             
        console.debug("Watching for blast submit");
        yield take(BLAST_SUBMIT_OK);
        yield race([
            call(fetchReportData),
            take(FETCH_REPORT_OK)
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
