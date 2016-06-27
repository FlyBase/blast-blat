import { createSelector } from 'reselect';

/**
 * Direct selector to the blat state domain
 */
const selectBlatDomain = () => state => state.get('blat');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Blat
 */

const selectBlat = () => createSelector(
  selectBlatDomain(),
  (substate) => substate.toJS()
);

export default selectBlat;
export {
  selectBlatDomain,
};
