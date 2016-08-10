/**
*
* DeleteResultButton
*
*/

import React, {PropTypes, Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import styles from './styles.css';

class DeleteResultButton extends Component {

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

    handleDelete = () => {
        this.handleClose();
        this.props.onDelete();
    }
    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
                    />,
            <FlatButton
                label="Delete"
                primary={true}
                onTouchTap={this.handleDelete}
            />,
        ];

        return (
            <div className={styles.deleteResultButton} onTouchTap={this.handleOpen}>
                {this.props.children}
                <Dialog actions={actions} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
                    Delete result?
                </Dialog>
            </div>
        );
    }
}

DeleteResultButton.propTypes = {
    onDelete: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default DeleteResultButton;
