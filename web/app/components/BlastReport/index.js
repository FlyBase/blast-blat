/**
*
* BlastReport
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import styles from './styles.css';

function BlastReport(props) {

    var divStyle = {
        margin: "0 auto",
    };
    var iframeStyle = {
        border: "1px solid black",
        width: "100%",
        height: "300px",
    };

    var url = "/jbrowse/index.html?data=data/" + encodeURIComponent(props.id) + "&tracklist=0&nav=1&overview=1&tracks=BLAST%20hits,Reference%20sequence,Query";

    return (
        <div>
            <b>Analysis name</b>: {props.job.name}
            <div style={divStyle}>
                <iframe style={iframeStyle} src={url}>
                </iframe>
            </div>
            <pre className={styles.blastReport}>
                {props.job.report}
            </pre>
        </div>
    );
}

export default BlastReport;
