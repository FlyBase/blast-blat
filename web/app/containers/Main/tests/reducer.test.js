import expect from 'expect';
import mainReducer from '../reducer';
import { fromJS } from 'immutable';

describe('mainReducer', () => {
  it('returns the initial state', () => {
    expect(mainReducer(undefined, {})).toEqual(fromJS({}));
  });
});
