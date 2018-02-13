import { types, flow } from 'mobx-state-tree';
import * as Api from '../utils/Api';
import Blast from './Blast';

/*
Root store

See https://github.com/mobxjs/mobx-state-tree
*/


const RootStore = types.model("RootStore", {
  blast: types.optional(types.array(Blast),[]),
  state: types.optional(types.enumeration("State", ["pending", "done", "error"]),'done'),
}).views( self => ({
  get numJobs() {
    return self.blast.length;
  }
})).actions(self => ({
  submitBlast: function (blast) {
    self.blast.push(blast);
  },
  /*
  Async loading of results using a generator function.
  https://github.com/mobxjs/mobx-state-tree/blob/master/docs/async-actions.md
   */
  loadResults: flow(function* loadResults() {
    self.blast = [];
    self.state = "pending"
    try {
      // This will block execution until the fetchResults() returns data.
      const resp = yield Api.fetchResults();
      for (let result of resp.data.resultset.result) {
        self.blast.push(result);
      }
      self.state = "done"
    } catch (error) {
      console.error("Failed to fetch results", error);
      self.state = "error";
    }
  }),
  deleteResult: flow(function* deleteResult(id) {
    try {
      // This will block execution until the fetchResults() returns data.
      yield deleteResult(id);
      self.blast
    } catch (error) {
      console.error("Failed to fetch results", error);
      self.state = "error";
    }
  }),

}));

export default RootStore.create({});