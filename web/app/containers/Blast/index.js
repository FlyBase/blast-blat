/*
 *
 * Blast
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectSequence, selectTool, selectDatabase } from './selectors';
import { changeSequence, changeDatabase, changeTool, submitBlast } from './actions';
import styles from './styles.css';
import {
    Button, Grid, Row, Col,
    Form, FormGroup, ControlLabel,
    FormControl
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

export class Blast extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        let deleteSeq;
        if (this.props.sequence.length > 0) {
            deleteSeq = (
                <Button bsStyle="danger" bsSize="xsmall"
                        onClick={this.props.onClearSequence}
                        className={styles.clearseq}>
                     <FontAwesome name="trash-o" />
                </Button>
            );
        }
        return (
            <div>
              <h3>NCBI BLAST</h3>
              <Form horizontal onSubmit={this.props.onSubmitBlast}>
                   <FormGroup controlID="db">
                       <Col componentClass={ControlLabel} sm={2}>
                           Database
                       </Col>
                       <Col sm={4}>
                           <FormControl componentClass="select"
                                        value={this.props.database}
                                        onChange={this.props.onChangeDatabase}>
                               <option value="scaffold">Genome Assembly</option>
                               <option value="genes" disabled>Annotated Genes</option>
                               <option value="proteins" disabled>Annotated Proteins</option>
                           </FormControl>
                       </Col>
                   </FormGroup>
                   <FormGroup controlID="program">
                       <Col componentClass={ControlLabel} sm={2}>
                           Program
                       </Col>
                       <Col sm={4}>
                           <FormControl componentClass="select"
                                        value={this.props.tool}
                                        onChange={this.props.onChangeTool}>
                               <option value="blastn">blastn</option>
                               <option value="blastp">blastp</option>
                           </FormControl>
                       </Col>
                   </FormGroup>
                   <FormGroup controlID="sequence">
                       <Col componentClass={ControlLabel} sm={2}>
                           Sequence
                       </Col>
                       <Col sm={8}>
                           <FormControl componentClass="textarea"
                                        placeholder="Enter sequence here..."
                                        value={this.props.sequence}
                                        rows={6}
                                        autoFocus
                                        spellCheck={false}
                                        onChange={this.props.onChangeSequence}>
                           </FormControl>
                           {deleteSeq}
                       </Col>
                   </FormGroup>
                   <FormGroup>
                      <Col smOffset={2} sm={4}>
                        <Button type="submit" bsSize="large" bsStyle="primary" block>
                            BLAST
                        </Button>
                      </Col>
                   </FormGroup>
              </Form>
            </div>
        );
  }
}

Blast.propTypes = {
    sequence: PropTypes.string.isRequired,
    tool: PropTypes.string.isRequired,
    database: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
    sequence: selectSequence(),
    tool: selectTool(),
    database: selectDatabase()
});

function mapDispatchToProps(dispatch) {
    return {
        onChangeSequence: (evt) => dispatch(changeSequence(evt.target.value)),
        onChangeTool: (evt) => dispatch(changeTool(evt.target.value)),
        onChangeDatabase: (evt) => dispatch(changeDatabase(evt.target.value)),
        onClearSequence: (evt) => dispatch(changeSequence('')),
        onSubmitBlast: (evt) => { evt.preventDefault(); dispatch(submitBlast()); },
        dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Blast);
