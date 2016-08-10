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

import { Row, Col } from 'react-bootstrap';
//import FontAwesome from 'react-fontawesome';

import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';

import Sequence from 'components/Sequence';
import Database from 'components/Database';
import Program from 'components/Program';
import styles from './styles.css';

export class Blast extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <div>
              <h3>NCBI BLAST</h3>
              <form>
                <Row>
                    <Col className="form-group" sm={4}>
                        <Database value={this.props.database} onChange={this.props.onChangeDatabase}>
                             <MenuItem value="scaffold" primaryText="Genome Assembly" />
                             <MenuItem value="genes" primaryText="Annotated Genes" />
                             <MenuItem value="proteins" primaryText="Annotated Proteins" />
                        </Database>
                    </Col>
                </Row>
                <Row>
                    <Col className="form-group" sm={4}>
                        <Program value={this.props.tool}
                                 onChange={this.props.onChangeTool}>
                            <MenuItem value="blastn" primaryText="Nucleotide to nucleotide (blastn)" />
                            <MenuItem value="blastp" primaryText="Protein to protein (blastp)" />
                        </Program>
                    </Col>
                </Row>
                <Row>
                    <Col className="form-group" sm={8}>
                        <Sequence value={this.props.sequence} onChange={this.props.onChangeSequence} onClear={this.props.onClearSequence} />
                    </Col>
                </Row>
                <Row>
                      <Col className="form-group" smOffset={1} sm={6}>
                        <RaisedButton
                            label="BLAST"
                            primary={true}
                            fullWidth={true}
                            onClick={this.props.onSubmitBlast}
                            />
                      </Col>
                </Row>
              </form>
            </div>
        );
  }
}

Blast.propTypes = {
    sequence: PropTypes.string.isRequired,
    tool: PropTypes.string.isRequired,
    database: PropTypes.string.isRequired
};

const mapStateToProps = createStructuredSelector({
    sequence: selectSequence(),
    tool: selectTool(),
    database: selectDatabase()
});

function mapDispatchToProps(dispatch) {
    return {
        onChangeSequence: (evt) => dispatch(changeSequence(evt.target.value)),
        onChangeTool: (evt, value) => dispatch(changeTool(value)),
        onChangeDatabase: (evt, value) => dispatch(changeDatabase(value)),
        onClearSequence: (evt) => dispatch(changeSequence('')),
        onSubmitBlast: (evt) => { dispatch(submitBlast()); },
        dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Blast);
