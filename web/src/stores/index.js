import { types } from 'mobx-state-tree';
import Blast from './Blast';

/*
Root store

See https://github.com/mobxjs/mobx-state-tree
*/


const RootStore = types.model("RootStore", {
  blast: types.optional(types.array(Blast),[]),
}).views( self => ({
  get numJobs() {
    return self.blast.length
  }
})).actions(self => {
  function submitBlast(blast) {
    self.blast.push(blast);
  }

  return { submitBlast };
});

export default RootStore;