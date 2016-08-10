/**
*
* ResultListItem
*
*/

import React, { PropTypes, Components } from 'react';
import classNames from 'classnames';
import FontIcon from 'material-ui/FontIcon';
import { red500 as red, blueGrey300 } from 'material-ui/styles/colors';
import { Link } from 'react-router';

import styles from './styles.css';
import DeleteResultButton from 'components/DeleteResultButton';

function ResultListItem(props) {
    const { jobid, name, tool, db, status } = props;
    const started = new Date(Math.round(Number.parseFloat(props.started)*1000));
    const result_tool = tool.indexOf('blast') >= 0 ? 'blast' : 'blat';

    function handleDelete(jobid, tool) {
        props.onDeleteResult(jobid,tool);
    }

    return (
        <tr>
            <td>
                <Link to={'/results/' + jobid}>
                    {name}
                </Link>
            </td>
            <td>{tool}</td>
            <td>{db.join(", ")}</td>
            <td>
                {
                    (() => {
                        switch (status) {
                        case "__failed__":
                            return <FontIcon title="Failed" className="material-icons" color={red}>error</FontIcon>;
                        case "__created__":
                        case "__working__":
                            return <FontIcon title="Running" className="fa fa-spinner fa-spin" />;
                        case "__completed__":
                            return <FontIcon title="Done" className="material-icons">done</FontIcon>;
                        default:
                            return <FontIcon title="Unknown" className="material-icons">sentiment-neutral</FontIcon>;
                        }
                    })()
                }
            </td>
            <td>{started.toLocaleString()}</td>
            <td>
                <Link to={'/results/' + jobid}>
                    <FontIcon title="View" hoverColor={blueGrey300} className={ classNames('material-icons',styles.actions) }>open_in_browser</FontIcon>
                </Link>
                <FontIcon title="Edit & Run" hoverColor={blueGrey300} className={ classNames('material-icons',styles.actions) }>edit</FontIcon>
                <DeleteResultButton onDelete={() => handleDelete(jobid,result_tool)}>
                    <FontIcon title="Delete" hoverColor={blueGrey300} className={ classNames('material-icons',styles.actions) }>delete</FontIcon>
                </DeleteResultButton>
            </td>
        </tr>
    );
}

ResultListItem.propTypes = {
    jobid: PropTypes.string,
    name: PropTypes.string,
    tool: PropTypes.string,
    db: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    started: PropTypes.string,
    onDeleteResult: PropTypes.func.isRequired
}

export default ResultListItem;
