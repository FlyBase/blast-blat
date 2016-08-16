/**
 *
 * ResultListItem
 *
 */

import React, { PropTypes, Components } from 'react';
import classNames from 'classnames';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { red500 as red, blueGrey300 } from 'material-ui/styles/colors';
import { Link } from 'react-router';

import styles from './styles.css';
import DeleteResultButton from 'components/DeleteResultButton';
import { COMPLETED, CREATED, WORKING, FAILED } from 'containers/App/constants';

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
                            case FAILED:
                                return <FontIcon title="Failed" className="material-icons" color={red}>error</FontIcon>;
                            case CREATED:
                            case WORKING:
                                return <FontIcon title="Running" className="fa fa-spinner fa-spin" />;
                            case COMPLETED:
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
                    <IconButton tooltip="View report" iconClassName="material-icons">
                        open_in_browser
                    </IconButton>
                </Link>
                <IconButton tooltip="Edit & run" iconClassName="material-icons">
                    edit
                </IconButton>
                <DeleteResultButton onDelete={() => handleDelete(jobid,result_tool)}>
                    <IconButton tooltip="Delete" iconClassName="material-icons">
                        delete
                    </IconButton>
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
