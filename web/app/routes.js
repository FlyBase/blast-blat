// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getHooks } from 'utils/hooks';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getHooks factory
  const { injectReducer, injectSagas } = getHooks(store);

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },    {
      path: '/blast',
      name: 'blast',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Blast/reducer'),
          System.import('containers/Blast/sagas'),
          System.import('containers/Blast'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('blast', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },    {
      path: '/blat',
      name: 'blat',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Blat/reducer'),
          System.import('containers/Blat/sagas'),
          System.import('containers/Blat'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('blat', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, 
       {
      path: '/results',
      name: 'results',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/ResultList/reducer'),
          System.import('containers/ResultList/sagas'),
          System.import('containers/ResultList'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('results', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },    {
      path: '/results/:jobid',
      name: 'resultItem',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/ResultReport/reducer'),
          System.import('containers/ResultReport/sagas'),
          System.import('containers/ResultReport'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('resultItem', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '*',


      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
