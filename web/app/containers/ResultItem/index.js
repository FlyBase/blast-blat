/*
 *
 * ResultItem
 *
 */

import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import selectResultItem from './selectors';

export class ResultItem extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
      const { jobid } = this.props.params;

      return (
          <div>
            jobID is { jobid }
          </div>
      );
  }
}

ResultItem.propTypes = {
    params: PropTypes.shape({
        params: PropTypes.string
    }).isRequired
}

const mapStateToProps = selectResultItem();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultItem);
