/*
 *
 * ResultReport
 *
 */

import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import selectResultReport from './selectors';

export class ResultReport extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
      const { jobid } = this.props.params;

      return (
          <div>
            jobID is { jobid }
          </div>
      );
  }
}

ResultReport.propTypes = {
    params: PropTypes.shape({
        params: PropTypes.string
    }).isRequired
}

const mapStateToProps = selectResultReport();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultReport);
