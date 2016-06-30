/*
 *
 * Main
 *
 */

import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { selectResultCount } from './selectors';
import styles from './styles.css';
import {Grid, Row, Col } from 'react-bootstrap';
import Sidebar from 'components/Sidebar';

export class Main extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
        <div>
             <Col md={2}>
                 <Sidebar changeRoute={this.props.changeRoute} resultCount={this.props.resultCount} />
             </Col>
             <Col md={10}>
                 {this.props.children}
             </Col>
        </div>
    );
  }
}

Main.propTypes = {
    changeRoute: PropTypes.func.isRequired,
    resultCount: PropTypes.number.isRequired
};

const mapStateToProps = createStructuredSelector({
    resultCount: selectResultCount()
});

function mapDispatchToProps(dispatch) {
    return {
        changeRoute: (url) => dispatch(push(url))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
