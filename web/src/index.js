import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

import store from './stores';

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
