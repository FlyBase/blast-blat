/*
 *
 * ResultReport
 *
 */

import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import selectResultReport from './selectors';

import { fetchReport } from './actions';

import ReportLoading from 'components/ReportLoading';
import BlastReport from 'components/BlastReport';

export class ResultReport extends Component { // eslint-disable-line react/prefer-stateless-function

    componentDidMount() {
        console.debug("componentDidMount called in ResultReport");
        this.props.onComponentDidMount(this.props.params.jobid);
    }

    render() {
        console.debug("Rendering ResultReport");
        const report = this.props.isReady ? <BlastReport {...this.props} /> : <ReportLoading />;

        return (
            <div>
                {report}
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
