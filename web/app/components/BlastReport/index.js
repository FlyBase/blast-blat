/**
*
* BlastReport
*
*/

import React, {Component, PropTypes} from 'react';

import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import { Row, Col, OverlayTrigger, Panel, Popover, Modal, Button, Table, Collapse } from 'react-bootstrap';

import { FormattedMessage } from 'react-intl';
import AlignmentGraphic from 'react-alignment-graphic';

import HitAlignment from 'components/HitAlignment';
import messages from './messages';

import styles from './styles.css';

class BlastReport extends Component {// eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);
        this.showModal     = this.showModal.bind(this);
        this.hideModal     = this.hideModal.bind(this);
        this.toggleGraphic = this.toggleGraphic.bind(this);

        this.state = {
            currentHit: null,
            showModal: false,
            showGraphic: true,
        };
    }

    toggleGraphic() {
        this.setState({showGraphic: !this.state.showGraphic});
    }

    showModal(evt, hit) {
        console.debug("showModal called");
        this.setState({currentHit: hit, showModal: true});
    }

    hideModal() {
        this.setState({showModal: false, currentHit: null});
    }

    renderHitModal(hit) {
        if (hit) {
            const desc = hit.description[0];
            const title = (
                <div>
                    <div><b>Hit ID:</b> {desc.id}</div>
                    <div><b>Hit Title:</b> {desc.title}</div>
                </div>
            );
            return (
                <Modal show={this.state.showModal} onHide={this.hideModal} bsSize="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>BLAST Hit Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Panel defaultExpanded header={title}>
                            <Table bordered condensed responsive>
                                <thead>
                                    <tr>
                                        <th>HSP #</th>
                                        <th>Evalue</th>
                                        <th>Score</th>
                                        <th>Identity</th>
                                        <th>Gaps</th>
                                        <th>Hit coord.</th>
                                        <th>Query coord.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    hit.hsps.map((hsp) => {
                                        return (
                                            <tr key={hsp.num}>
                                            <td>{hsp.num}</td>
                                            <td>{hsp.evalue}</td>
                                            <td>{hsp.bit_score}</td>
                                            <td>{Math.round((hsp.identity / hsp.align_len)*100)}%</td>
                                            <td>{hsp.gaps}</td>
                                            <td>{hsp.hit_from}..{hsp.hit_to}</td>
                                            <td>{hsp.query_from}..{hsp.query_to}</td>
                                            </tr>
                                        );
                                    })
                                }
                                </tbody>
                            </Table>
                        </Panel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            );
        }
        return null;
    }

    render () {
        const imageInfoOverlay = (
            <Popover id="BLAST-image-helper-text" title="BLAST Overview">
                <ul>
                    <li>Click the image to view the sequence position.</li>
                    <li>To hide the position ruler, click on the "Position" label near the top.</li>
                    <li>Click a BLAST hit to see more information about it.</li>
                </ul>
            </Popover>
        );
        const report = this.props.job.report.BlastOutput2[0].report;

        let hitElems = [];
        if (report.results.search.hits) {
            hitElems = report.results.search.hits.map((hit) => {
                return (
                    <HitAlignment key={hit.num} hit={hit} />
                );
            });
        }

        const graphicToggle = (this.state.showGraphic) ? 'expand_more' : 'expand_less';

        const graphicHeading = (
            <div onClick={this.toggleGraphic}>
                <b>Overview Graphic</b> <FontIcon className="material-icons">{graphicToggle}</FontIcon>
            </div>
        );
        const alignmentHeader = (<b>Alignments</b>);
        return (
            <div>
                <Row>
                    <Col sm={6}><b>Analysis name</b>: {this.props.job.name}</Col>
                    <Col sm={6}><b>Query</b>: {report.results.search.query_id}</Col>
                </Row>
                <Panel collapsible defaultExpanded header={graphicHeading}>
                    <div>
                        <OverlayTrigger trigger={['click','hover','focus']} placement="right" overlay={imageInfoOverlay}>
                            <FontIcon className="material-icons">info_outline</FontIcon>
                        </OverlayTrigger>
                        <AlignmentGraphic blastResult={this.props.job.report} hitClickHandler={this.showModal} />
                    </div>
                </Panel>
                <Panel header={alignmentHeader}>
                    {hitElems}
                </Panel>
                {this.renderHitModal(this.state.currentHit)}
            </div>
        );
    }
}

export default BlastReport;
