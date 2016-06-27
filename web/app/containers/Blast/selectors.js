import { createSelector } from 'reselect';

/**
 * Direct selector to the blast state domain
 */
const selectBlastDomain = () => state => state.get('blast');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Blast
 */

const selectBlast = () => createSelector(
  selectBlastDomain(),
  (substate) => substate.toJS()
);

export default selectBlast;
export {
  selectBlastDomain,
};
