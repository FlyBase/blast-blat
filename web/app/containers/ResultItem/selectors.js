import { createSelector } from 'reselect';

/**
 * Direct selector to the resultItem state domain
 */
const selectResultItemDomain = () => state => state.get('resultItem');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ResultItem
 */

const selectResultItem = () => createSelector(
  selectResultItemDomain(),
  (substate) => substate.toJS()
);

export default selectResultItem;
export {
  selectResultItemDomain,
};
