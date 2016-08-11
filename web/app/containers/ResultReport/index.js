/*
 *
 * ResultReport
 *
 */

import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import selectResultReport from './selectors';

import { fetchReport } from './actions';

export class ResultReport extends Component { // eslint-disable-line react/prefer-stateless-function

    componentDidMount() {
        console.debug("componentDidMount called in ResultReport");
        this.props.onComponentDidMount(this.props.params.jobid);
    }

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
        jobid: PropTypes.string
    }).isRequired
}

const mapStateToProps = selectResultReport();

function mapDispatchToProps(dispatch) {
  return {
      onComponentDidMount: (jobid) => dispatch(fetchReport(jobid)),
      dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultReport);
