/*
 *
 * Sidebar
 *
 */

import React, {PropTypes,Component} from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
import styles from './styles.css';

import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { Badge } from 'react-bootstrap';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import { cyan600 as cyan } from 'material-ui/styles/colors';

import { selectResultCount } from 'containers/App/selectors';
import { loadResults } from 'containers/App/actions';

export class Sidebar extends Component { // eslint-disable-line react/prefer-stateless-function

    componentDidMount() {
        console.debug("componentDidMount called in SideBar");
        this.props.onComponentDidMount();
    }

    render() {
        return (
            <List>
                <Link to='/blast'> 
                    <ListItem insetChildren primaryText="BLAST" />
                </Link>
                <Divider />
                <Link to="/blat">
                    <ListItem insetChildren primaryText="BLAT"  />
                </Link>
                <Divider />
                <Link to="/results">
                    <ListItem 
                            leftIcon={<FontIcon className="material-icons">assessment</FontIcon>}>
                        Results
                        <Badge style={{backgroundColor: cyan}} className={styles.resultcount}>{this.props.resultCount}</Badge>
                    </ListItem>
                </Link>
            </List>
        );
    }
}

Sidebar.defaultProps = {
    resultCount: 0
};

Sidebar.propTypes = {
    resultCount: PropTypes.number
};


const mapStateToProps = createStructuredSelector({
    resultCount: selectResultCount()
});

function mapDispatchToProps(dispatch) {
    return {
        onComponentDidMount: () => dispatch(loadResults()),
        dispatch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
