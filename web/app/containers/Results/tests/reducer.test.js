import expect from 'expect';
import resultsReducer from '../reducer';
import { fromJS } from 'immutable';

describe('resultsReducer', () => {
  it('returns the initial state', () => {
    expect(resultsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
