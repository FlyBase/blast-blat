import { createSelector } from 'reselect';

/**
 * Direct selector to the resultItem state domain
 */
const selectResultReportDomain = () => state => state.get('resultItem');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ResultReport
 */

const selectResultReport = () => createSelector(
  selectResultReportDomain(),
  (substate) => substate.toJS()
);

export default selectResultReport;
export {
  selectResultReportDomain,
};
