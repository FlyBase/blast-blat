import Blast from '../';
import {
  CREATED,
  COMPLETED,
  FAILED,
  WORKING
} from "../../../constants";

it('Basic default Blast', () => {
  const myBlast = { name: 'myblast', sequence: 'GCAT' };
  const blast = Blast.create(myBlast);
  expect(blast).toMatchObject(myBlast);
});

it('Required fields', () => {
  expect(() => {
    // This should throw an error.
    Blast.create({});
  }).toThrow();
});

it('database', () => {
  const myBlast = { name: 'myblast', sequence: 'GCAT', database: 'mRNA' };
  const blast = Blast.create(myBlast);
  expect(blast.database).toBe('mRNA');
});

it('error', () => {
  const myBlast = { name: 'myblast', sequence: 'GCAT', error: 'my error' };
  const blast = Blast.create(myBlast);
  expect(blast.error).toBe('my error');
});

it('evalue', () => {
  let myBlast = { name: 'myblast', sequence: 'GCAT', evalue: 0.001 };
  const blast = Blast.create(myBlast);
  expect(blast.evalue).toBe(0.001);

  expect(() => {
    myBlast = { name: 'myblast', sequence: 'GCAT', evalue: 'blah' };
    const blast2 = Blast.create(myBlast);
  }).toThrow();
});

it('name', () => {
  const myBlast = { name: 'myblast', sequence: 'GCAT' };
  const blast = Blast.create(myBlast);
  expect(blast.name).toBe('myblast');
});

it('sequence', () => {
  const myBlast = { name: 'myblast', sequence: 'GCAT' };
  const blast = Blast.create(myBlast);
  expect(blast.sequence).toBe('GCAT');
});

it('sequence', () => {
  const myBlast = { name: 'myblast', sequence: 'GCAT' };
  const blast = Blast.create(myBlast);
  expect(blast.sequence).toBe('GCAT');
});

it('species', () => {
  const myBlast = { name: 'myblast', sequence: 'GCAT', species: ['dmel','dpse'] };
  const blast = Blast.create(myBlast);
  expect(blast.species.peek()).toEqual(myBlast.species);
});

it('status', () => {
  const myBlast = { name: 'myblast', sequence: 'GCAT' };
  const blast = Blast.create(myBlast);
  expect(blast.status).toBe(CREATED);

  blast.setStatus(WORKING);
  expect(blast.status).toBe(WORKING);

  blast.setStatus(COMPLETED);
  expect(blast.status).toBe(COMPLETED);

  blast.setStatus(FAILED);
  expect(blast.status).toBe(FAILED);
});

it('tool', () => {
  let myBlast = { name: 'myblast', sequence: 'GCAT' };
  const blast = Blast.create(myBlast);
  expect(blast.tool).toBe('blastn');

  myBlast = { name: 'myblast', sequence: 'GCAT', tool: 'blastp' };
  const blast2 = Blast.create(myBlast);
  expect(blast2.tool).toBe('blastp');

  expect(() => {
    Blast.create({ name: 'myblast', sequence: 'GCAT', tool:'tblastnpx'});
  }).toThrow();
});
