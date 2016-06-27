/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a neccessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';

import jQuery from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'font-awesome/css/font-awesome.min.css';
import {Grid, Row, Col } from 'react-bootstrap';

import Main from 'containers/Main';

export default class App extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: React.PropTypes.node,
  };

  render() {
    return (
        <Grid fluid={true}>
            <Row> 
                <Col xs={12} className="text-center">
                    <h1>Sequence Alignment Tools</h1>
                </Col>
            </Row>
            <Row>
                <Main>
                    {this.props.children}
                </Main>
            </Row>
        </Grid>
    );
  }
}
