/**
*
* Name
*
*/

import React from 'react';

import TextField from 'material-ui/TextField';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import styles from './styles.css';

function Name(props) {
  return (
    <div className={styles.name}>
        <TextField hintText="Enter something memorable."
            floatingLabelText="Analysis Name"
            floatingLabelFixed={true}
            value={props.value}
            fullWidth={true}
            onChange={props.onChange}
        />
    </div>
  );
}

export default Name;
