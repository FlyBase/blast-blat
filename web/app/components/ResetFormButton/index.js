/**
*
* ResetFormButton
*
*/

import React, {PropTypes, Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import styles from './styles.css';

class ResetFormButton extends Component {

    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    handleOpen = () => {
        this.setState({open: true});
    }

    handleClose = () => {
        this.setState({open: false});
    }

    handleReset = () => {
        this.handleClose();
        this.props.onReset();
    }
    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
                    />,
            <FlatButton
                label="Reset"
                primary={true}
                onTouchTap={this.handleReset}
            />,
        ];

        return (
            <div className={styles.ResetFormButton} onTouchTap={this.handleOpen}>
                {this.props.children}
                <Dialog actions={actions} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
                    {this.props.text}
                </Dialog>
            </div>
        );
    }
}

ResetFormButton.defaultValues = {
    text: 'Reset the form?'
};

ResetFormButton.propTypes = {
    onReset: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    text: PropTypes.string,
};

export default ResetFormButton;
