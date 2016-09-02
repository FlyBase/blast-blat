/**
*
* HspAlignment
*
*/

import React, {PropTypes} from 'react';

//import { FormattedMessage } from 'react-intl';
//import messages from './messages';

import styles from './styles.css';
import { Row, Col } from 'react-bootstrap';

function HspAlignment(props) {


    const { hsp, width } = props;
    const numLines = Math.ceil(hsp.qseq.length / width)
    const maxLen   = hsp.qseq.length;
    // Split the strings into arrays for each character.
    const querySeq = [...hsp.qseq];
    const midline  = [...hsp.midline];
    const hitSeq   = [...hsp.hseq];

    let rows = [];
    let start = 0;
    let stop = width - 1;
    for (let i=0; i<numLines; i++) {
        /**
         * 0-59
         * 60-119
          * */
        // Adjust stop if we go beyond the end of the sequence.
        if (stop > maxLen) { stop = maxLen; }

        rows.push(
            <Row className={styles.row} key={i}>
                <Col xs={1}></Col>
                <Col xs={10}>
                    <div>{querySeq.slice(start,stop)}</div>
                    <div>{midline.slice(start,stop)}</div>
                    <div>{hitSeq.slice(start,stop)}</div>
                </Col>
                <Col xs={1}></Col>
            </Row>
        );
        start = start + width;
        stop = start + width - 1;
    }

    return (
        <div className={styles.hspAlignment}>
            {rows}
        </div>
    );
}

HspAlignment.propTypes = {
    hsp: PropTypes.shape({
        qseq: PropTypes.string,
        midline: PropTypes.string,
        hseq: PropTypes.string,
    }).isRequired,
    width: PropTypes.number,
};

HspAlignment.defaultProps = {
    width: 60,
};

export default HspAlignment;
