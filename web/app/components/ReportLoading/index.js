/**
*
* ReportLoading
*
*/

import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import styles from './styles.css';
import {Row, Col } from 'react-bootstrap';

function ReportLoading(props) {
    return (
        <div className={styles.reportLoading}>
            <Row>
                <Col mdOffset={2} md={12}> 
                    <CircularProgress size={2} />
                </Col>
            </Row>
            <Row>
                <Col mdOffset={2} md={12}>
                    <FormattedMessage {...messages.loading} />
                </Col>
            </Row>
        </div>
    );
}

export default ReportLoading;
