import RootStore from '../';
import Blast from '../Blast';


it('rootStore default constructor', () => {
  const store = RootStore.create({});
  expect(store).toBeDefined();
});

it('numJobs', () => {
  const store = RootStore.create({});
  expect(store.numJobs).toBe(0);
  store.submitBlast(Blast.create({ name: 'myblase', sequence: 'GCATA' }));
  expect(store.numJobs).toBe(1);
});

it('submitBlast', () => {
  const store = RootStore.create({});

  store.submitBlast(Blast.create({ name: 'myblase', sequence: 'GCATA' }));

  expect(store.numJobs).toBe(1);

  expect(() => {
    store.submitBlast(Blast.create({}));
  }).toThrow();

  expect(store.numJobs).toBe(1);
});
