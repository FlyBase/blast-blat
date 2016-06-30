/*
 *
 * Results
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { selectResults } from './selectors';
import styles from './styles.css';

export class Results extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.results}>
      This is Results container !
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
    resultCount: selectResultCount()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Results);
