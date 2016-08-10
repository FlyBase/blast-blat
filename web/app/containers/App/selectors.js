import { createSelector } from 'reselect';

const selectGlobalDomain = () => state => state.get('global');

const selectGlobal = () => createSelector(
  selectGlobalDomain(),
  (global) => global.toJS()
);

const selectResults = () => createSelector(
    selectGlobal(),
    (global) => global.results
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


// selectLocationState expects a plain JS object for the routing state
const selectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export {
    selectLocationState,
    selectGlobalDomain,
    selectGlobal,
    selectResults,
    selectBlastResults,
    selectBlatResults,
    selectResultCount
};
