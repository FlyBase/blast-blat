import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

class App extends Component {
  render() {
    console.log(this.props.store.toJSON());
    return (
      <div className="App">
          My app.  Num jobs is { this.props.store.numJobs }
      </div>
    );
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired,
}

export default observer(App);

