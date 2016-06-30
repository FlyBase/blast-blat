import { createSelector } from 'reselect';

/**
 * Direct selector to the main state domain
 */
const selectMainDomain = () => state => state.get('main');

/**
 * Default selector used by Main
 */
const selectMain = () => createSelector(
  selectMainDomain(),
  (main) => main.toJS()
);

const selectResults = () => createSelector(
    selectMain(),
    (main) => main.results
);

const selectBlastResults = () => createSelector(
    selectResults(),
    (results) => results.blast
);

const selectBlatResults = () => createSelector(
    selectResults(),
    (results) => results.blat
);

const selectResultCount = () => createSelector(
    selectBlastResults(),
    selectBlatResults(),
    (x, y) => x.length + y.length
);

export default selectMain;

export {
    selectMainDomain,
    selectResults,
    selectBlastResults,
    selectBlatResults,
    selectResultCount
};
