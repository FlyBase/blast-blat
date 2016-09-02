/**
*
* HitAlignment
*
*/

import React, {Component, PropTypes}  from 'react';

import FontIcon from 'material-ui/FontIcon';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';

import HspAlignment from 'components/HspAlignment';
import { FormattedMessage } from 'react-intl';
//import messages from './messages';
import styles from './styles.css';

class HitAlignment extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            open: false,
        }
    }

    handleClick() {
        this.setState({open: !this.state.open});
    }

    render() {
        const { hit } = this.props;
        const iconName = (this.state.open) ? 'expand_more' : 'expand_less';
        const desc = hit.description[0];

        const hitHeader = (
            <div onClick={this.handleClick}>
                <div>{desc.id} <FontIcon className="material-icons">{iconName}</FontIcon></div>
            </div>
        );

        return (
            <Panel collapsible defaultExpanded header={hitHeader}>
                <div>{desc.title}</div>
                <ListGroup fill>
            {
                hit.hsps.map((hsp) => {
                    return (
                        <ListGroupItem>
                            <HspAlignment key={hsp.num} hsp={hsp} />
                        </ListGroupItem>
                    );
                })
            }
                </ListGroup>
            </Panel>
        );
    }
}

HitAlignment.propTypes = {
    hit: PropTypes.object.isRequired,
};

export default HitAlignment;
