/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
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
import {Grid, Row, Col, Button, Badge } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
        <div>
            Choose one of the icons on the left.
        </div>
    );
  }
}
