import { createSelector } from 'reselect';

/**
 * Direct selector to the blast state domain
 */
const selectBlast = () => (state) => state.get('blast');

/**
 * Other specific selectors
 */

const selectBlastForApi = () => createSelector(
  selectBlast(),
  (blast) => (
      {
          query: [blast.get('sequence')],
          db: [blast.get('database')],
          tool: blast.get('tool'),
          name: blast.get('name'),
      }
  )
);

const selectSequence = () => createSelector(
  selectBlast(),
  (blast) => blast.get('sequence')
);

const selectTool = () => createSelector(
  selectBlast(),
  (blast) => blast.get('tool')
);

const selectDatabase = () => createSelector(
  selectBlast(),
  (blast) => blast.get('database')
);

const selectName = () => createSelector(
  selectBlast(),
  (blast) => blast.get('name')
);
export default selectBlast;

export {
  selectSequence,
  selectTool,
  selectDatabase,
  selectName,
  selectBlastForApi
};
