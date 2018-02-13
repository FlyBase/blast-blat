import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import { onSnapshot, applySnapshot } from 'mobx-state-tree';
import registerServiceWorker from './registerServiceWorker';

import RootStore from './stores';

const store = RootStore.create({});

onSnapshot(store, (snapshot) => {
  const localStorage = window.localStorage;
  localStorage.setItem('flybase.blast',JSON.stringify(snapshot));
});

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
