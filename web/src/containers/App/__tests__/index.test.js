import React from 'react';
import ReactDOM from 'react-dom';
import App from '../';

import store from '../../../stores';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App store={store}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
