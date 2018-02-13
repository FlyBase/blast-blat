import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

import RootStore from './stores';

const store = RootStore.create({});

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
