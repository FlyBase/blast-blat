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

import 'bootstrap-css-only/css/bootstrap.css';
import 'material-design-icons/iconfont/material-icons.css';

import {Grid, Row, Col } from 'react-bootstrap';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Sidebar from 'containers/Sidebar';

function App(props) {
    return (
        <MuiThemeProvider>
            <Grid fluid={true}>
                <Row> 
                    <Col xs={12} className="text-center">
                        <h1>Sequence Alignment Tools</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>
                        <Sidebar />
                    </Col>
                    <Col md={10}>
                        {React.Children.toArray(props.children)}
                    </Col>
                </Row>
            </Grid>
        </MuiThemeProvider>
    );
}

App.propTypes = {
    children: React.PropTypes.node,
};

export default App;
