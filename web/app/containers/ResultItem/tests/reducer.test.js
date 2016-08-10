import expect from 'expect';
import resultItemReducer from '../reducer';
import { fromJS } from 'immutable';

describe('resultItemReducer', () => {
  it('returns the initial state', () => {
    expect(resultItemReducer(undefined, {})).toEqual(fromJS({}));
  });
});
