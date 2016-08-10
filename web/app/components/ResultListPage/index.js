/**
*
* ResultListPage
*
*/

import React, { PropTypes } from 'react';
import { Row, Col, Image, Table } from 'react-bootstrap';
import { Link } from 'react-router';

import Paper from 'material-ui/Paper';
import { grey400 } from 'material-ui/styles/colors';

import ResultListItem from 'components/ResultListItem';
import styles from './styles.css';
import NcbiIcon from './NCBI.png';
import UcscIcon from './UCSC.png';

function ResultListPage(props) {

    const result = props.count == 0 ? renderNoResult() : renderResult();
    return <div>{result}</div>;

    function renderNoResult() {
        if (props.count == 0) {
            return (
                <div>
                    <Row>
                        <Col md={10} mdOffset={2}>
                            <h3>No results here, better get to work!</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} mdOffset={1}>
                            <Link to='/blast'>
                                <Paper zDepth={3} className={styles.tool_icons}>
                                    <h3 className="text-center">BLAST</h3>
                                    <Image className="center-block" src={NcbiIcon} thumbnail rounded responsive />
                                </Paper>
                            </Link>
                        </Col>
                        <Col md={4}>
                            <Link to='/blat/'>
                                <Paper zDepth={3} className={styles.tool_icons}>
                                    <h3 className="text-center">BLAT</h3>
                                    <Image className="center-block" src={UcscIcon} thumbnail rounded responsive />
                                </Paper>
                            </Link>
                        </Col>
                    </Row>
                </div>
            );
        }
        return null;
    }

    function renderResult() {
        return (
            <div className={styles.top}>
                {renderNoResult()}
                <Row>
                    <Col md={12}>
                        <Table responsive hover>
                            <thead>
                                <tr style={{ color: grey400 }}>
                                    <th>Name</th>
                                    <th>Program</th>
                                    <th>Database</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {props.items.sort((a, b) => { return a - b; }).map((item) => {
                                return (
                                    <ResultListItem key={item.jobid} {...item} onDeleteResult={props.onDeleteResult}/>
                                );
                            })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        );
    }
}

ResultListPage.defaultProps = {
    count: 0
};

ResultListPage.propTypes = {
    count: PropTypes.number,
    onDeleteResult: PropTypes.func.isRequired
}

export default ResultListPage;
