import expect from 'expect';
import blatReducer from '../reducer';
import { fromJS } from 'immutable';

describe('blatReducer', () => {
  it('returns the initial state', () => {
    expect(blatReducer(undefined, {})).toEqual(fromJS({}));
  });
});
