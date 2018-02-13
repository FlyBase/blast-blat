import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';


class Blast extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.store.submitBlast({name: 'myblast',sequence:'GCATA'});
  }

  render() {
    return (
      <div>
        <h1>BLAST</h1>
        <button onClick={this.handleSubmit}>BLAST</button>
      </div>
    );
  }
}

Blast.propTypes = {
  store: PropTypes.object.isRequired,
};

export default observer(Blast);
