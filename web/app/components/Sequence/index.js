/**
*
* Sequence
*
*/
import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';

import styles from './styles.css';

function Sequence(props) {
    function renderClearSeq() {
        if (props.value && props.value.length > 0) {
            return (
                 <FloatingActionButton backgroundColor="#d9534f" className={styles.clearseq} onClick={props.onClear} mini={true}>
                      <FontIcon className="material-icons">clear</FontIcon>
                 </FloatingActionButton>
            );
        }
    }

    //TextField doesn't support class names so we can't use the
    //styles object above.
    const textStyle = {
        sequence: {
            "fontFamily": "'Roboto Mono', monospace",
            "fontSize": 12
        }
    }

    return (
        <div>
            <TextField
                inputStyle={textStyle.sequence}
                hintText="Enter your DNA, RNA or protein sequence."
                floatingLabelText="Sequence"
                floatingLabelFixed={true}
                multiLine={true}
                fullWidth={true}
                rows={6}
                rowsMax={12}
                value={props.value}
                onChange={props.onChange} />
            {renderClearSeq()}
        </div>
    );
}

Sequence.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onClear: PropTypes.func
};

Sequence.defaultProps = {
    value: ''
};

export default Sequence;
