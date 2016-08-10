/*
 *
 * ResultList
 *
 */

import React, {PropTypes,Component} from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
    selectBlastResults,
    selectBlatResults,
    selectResultCount
} from 'containers/App/selectors';

import { deleteResult } from 'containers/App/actions';

import ResultListPage from 'components/ResultListPage';

export class ResultList extends Component { // eslint-disable-line react/prefer-stateless-function

    render() {
        const { blast, blat, count } = this.props;
        return <ResultListPage count={count} items={[...blast,...blat]} onDeleteResult={this.props.onDeleteResult} />
    }
}

ResultList.defaultProps = {
    blast: [],
    blat: []
}

ResultList.propTypes = {
    blast: PropTypes.array,
    blat: PropTypes.array
};

const mapStateToProps = createStructuredSelector({
    blast: selectBlastResults(),
    blat: selectBlatResults(),
    count: selectResultCount()
});

function mapDispatchToProps(dispatch) {
  return {
      onDeleteResult: (jobid, tool) => dispatch(deleteResult(jobid, tool)),
      dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultList);
