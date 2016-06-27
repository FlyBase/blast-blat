import { createSelector } from 'reselect';

/**
 * Direct selector to the main state domain
 */
const selectMain = () => state => state.get('main');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Main
 */

const selectResults = () => createSelector(
  selectMainDomain(),
  (main) => main.get('results')
);

export default selectMain;

export {
  selectResults,
  selectMain
};
