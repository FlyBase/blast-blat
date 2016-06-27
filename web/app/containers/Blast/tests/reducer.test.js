import expect from 'expect';
import blastReducer from '../reducer';
import { fromJS } from 'immutable';

describe('blastReducer', () => {
  it('returns the initial state', () => {
    expect(blastReducer(undefined, {})).toEqual(fromJS({}));
  });
});
