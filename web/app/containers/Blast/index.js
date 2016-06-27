/*
 *
 * Blast
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectBlast from './selectors';
import styles from './styles.css';

export class Blast extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.blast}>
      This is Blast container !
      </div>
    );
  }
}

const mapStateToProps = selectBlast();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Blast);
