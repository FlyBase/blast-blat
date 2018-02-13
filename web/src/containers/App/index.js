import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect, BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { observer } from 'mobx-react';

import Blast from '../Blast';
import Results from '../Results';

class App extends Component {
  render() {
    const { store } = this.props;
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/blast">BLAST</Link>
            </li>
            <li>
              <Link to="/results">Results</Link>
            </li>
          </ul>

          <hr />

          <Switch>
            <Route exact={true} path='/'>
              <Redirect to='/blast' />
            </Route>
            <Route path='/blast'>
              <Blast store={store} />
            </Route>
            <Route path='/results' component={Results} />
          </Switch>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired,
};

export default observer(App);

