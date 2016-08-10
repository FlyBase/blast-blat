/**
*
* Database
*
*/

import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import styles from './styles.css';

function Database(props) {
    function handleChange(event, index, value) {
        console.debug("Database onChange called");
        props.onChange(event, value);
    }

    return (
        <SelectField
            value={props.value}
            onChange={handleChange}
            floatingLabelText="Database"
            floatingLabelFixed={true}
            fullWidth={true}>
            {props.children}
        </SelectField>
    );
}

Database.propTypes = {
    value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
    ]),
    onChange: PropTypes.func,
    children: PropTypes.arrayOf(React.PropTypes.element).isRequired
};

export default Database;
