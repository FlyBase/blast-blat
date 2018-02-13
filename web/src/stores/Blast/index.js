import {types} from 'mobx-state-tree';
import {v4} from 'uuid';

import {
 CREATED,
 WORKING,
 COMPLETED,
 FAILED
} from "../../constants";

/*
BLAST store

See https://github.com/mobxjs/mobx-state-tree
 */

const Blast = types.model("BlastStore", {
  database: 'scaffold',
  error: '',
  evalue: 10,
  id: types.optional(types.identifier(types.string),v4()),
  name: types.string,
  sequence: types.string,
  species: types.optional(types.array(types.string),['dmel']),
  status: types.optional(types.enumeration("Status", [CREATED,WORKING,COMPLETED,FAILED]), CREATED),
  tool: types.optional(types.enumeration("Tool", ['blastn','blastp','blastx','tblastn','tblastx']), 'blastn'),
}).views( self => ({
  get isDone() {
    return self.status === COMPLETED || self.status === FAILED;
  }
})).actions(self => ({
  setStatus: function (status) {
    self.status = status;
  }
}));

export default Blast;
