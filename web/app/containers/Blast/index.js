/*
 *
 * Blast
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectSequence, selectTool, selectDatabase, selectName } from './selectors';
import {
    changeSequence,
    changeDatabase,
    changeTool,
    changeName,
    reset,
    submitBlast,
} from './actions';

import { Row, Col } from 'react-bootstrap';

import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import Sequence from 'components/Sequence';
import Database from 'components/Database';
import Program from 'components/Program';
import Name from 'components/Name';
import ResetFormButton from 'components/ResetFormButton';

import styles from './styles.css';

export class Blast extends React.Component { // eslint-disable-line react/prefer-stateless-function

    render() {
        // Reset the reset (sanitize.css) module, which makes the material-ui
        // ListItem components look like buttons.
        const btnStyleReset = {
            'WebkitAppearance': 'inherit'
        };
        return (
            <div>
                <Row>
                    <Col xs={6}>
                        <b><span className={styles.title}>NCBI BLAST</span></b>
                    </Col>
                    <Col xs={6}>
                        <ResetFormButton text="Reset the form?" onReset={this.props.onResetForm}>
                            <IconButton tooltip="Reset the form" iconClassName="material-icons">
                                clear_all
                            </IconButton>
                        </ResetFormButton>
                    </Col>
                </Row>
                <form>
                    <Row>
                        <Col className="form-group" md={6} sm={10} xs={12}>
                            <Name value={this.props.name} onChange={this.props.onChangeName} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="form-group" md={6} sm={10} xs={12}>
                            <Database value={this.props.database} onChange={this.props.onChangeDatabase}>
                                <MenuItem style={btnStyleReset} value="scaffold" primaryText="Genome Assembly" />
                                <MenuItem style={btnStyleReset} value="genes" primaryText="Annotated Genes" />
                                <MenuItem style={btnStyleReset} value="proteins" primaryText="Annotated Proteins" />
                            </Database>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="form-group" md={6} sm={10} xs={12}>
                            <Program value={this.props.tool}
                                onChange={this.props.onChangeTool}>
                                <MenuItem style={btnStyleReset} value="blastn" primaryText="Nucleotide to nucleotide (blastn)" />
                                <MenuItem style={btnStyleReset} value="blastp" primaryText="Protein to protein (blastp)" />
                                <MenuItem style={btnStyleReset} value="blastx" primaryText="Translated nucleotide to protein (blastx)" />
                                <MenuItem style={btnStyleReset} value="tblastn" primaryText="Protein to translated nucleotide (tblastn)" />
                                <MenuItem style={btnStyleReset} value="tblastx" primaryText="Translated nucleotide to translated nucleotide (tblastx)" />
                            </Program>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="form-group" md={9} sm={10} xs={12}>
                            <Sequence value={this.props.sequence} onChange={this.props.onChangeSequence} onClear={this.props.onClearSequence} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="form-group" smOffset={1} md={6} sm={8}>
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
    database: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
    sequence: selectSequence(),
    tool: selectTool(),
    database: selectDatabase(),
    name: selectName()
});

function mapDispatchToProps(dispatch) {
    return {
        onChangeSequence: (evt) => dispatch(changeSequence(evt.target.value)),
        onChangeTool: (evt, value) => dispatch(changeTool(value)),
        onChangeDatabase: (evt, value) => dispatch(changeDatabase(value)),
        onChangeName: (evt, value) => dispatch(changeName(value)),
        onClearSequence: (evt) => dispatch(changeSequence('')),
        onSubmitBlast: (evt) => { dispatch(submitBlast()); },
        onResetForm: (evt) => { dispatch(reset()) },
        dispatch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Blast);
