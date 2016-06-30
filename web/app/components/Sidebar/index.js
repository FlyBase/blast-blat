/**
*
* Sidebar
*
*/

import React, {PropTypes} from 'react';

import styles from './styles.css';

import { Button, Badge } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(url) {
        this.props.changeRoute(url);
    }

    render() {
        return (
            <div>
                <Button bsSize="large" block onClick={e => this.handleClick('/blast')}>BLAST</Button>
                <Button bsSize="large" block onClick={e => this.handleClick('/blat')}>BLAT</Button>
                <Button bsSize="large" block onClick={e => this.handleClick('/results')}>
                    <FontAwesome name="bar-chart" /> Results <Badge>{this.props.resultCount}</Badge>
                </Button>
            </div>
        );
    }
}

Sidebar.defaultProps = {
    resultCount: 0
};

Sidebar.propTypes = {
    changeRoute: PropTypes.func.isRequired,
    resultCount: PropTypes.number
};

export default Sidebar;
