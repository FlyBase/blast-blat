/**
*
* SequenceViewerModal
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './styles.css';

class SequenceViewerModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.sequenceViewerModal}>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

export default SequenceViewerModal;
