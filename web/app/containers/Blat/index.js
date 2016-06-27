/*
 *
 * Blat
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectBlat from './selectors';
import styles from './styles.css';

export class Blat extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.blat}>
      This is Blat container !
      </div>
    );
  }
}

const mapStateToProps = selectBlat();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Blat);
