import React from 'react';
import { Link } from "react-router-dom";
import { Alert, Button, Table, Tag, Popconfirm } from "antd";
import { UserProfilePreview } from "../../components/ReferredByInput";
import { slugify } from '../../services/utils';
import { CSVLink } from 'react-csv';
import { convertApplicationsToCSVFormat, maxApplicationScoreDifference } from '../Application/ApplicationUtils';


// Show a warning
export const maxReviewerScoreDifference = 3;

export class ApplicationsTable extends  React.Component {
    constructor(props) {
        super(props);

        const { scholarship } = this.props;

        this.state = {
            // Automatically show the scores by default if the winner has been selected.
            showScores: scholarship.is_winner_selected
        }
    }

    setShowScores(showScores) {
        this.setState({showScores});
    }

    render () {

        const { applications, scholarship, selectWinner, isScholarshipOwner, assignReviewerButton } = this.props;
        const { collaborators, owner_detail } = scholarship;
        const { showScores } = this.state;
    
        let allReviewers = [...collaborators, owner_detail];
    
        let assignedReviewersFilter = allReviewers.map(collaborator => {
            return {
                'text': collaborator.username,
                'value': collaborator.username
            };
        });
    
        const possibleScores = [null, ...Array(11).keys()];
    
        const possibleScoresFilter = possibleScores.map(possibleScore => {
            return {
                'text': possibleScore === null ? "None" : possibleScore,
                'value': possibleScore
            };
        });
    
        let applicationsAsCSV = convertApplicationsToCSVFormat(applications);
    
        const selectWinnerColumn = {
            title: <b>Select Winner</b>,
            dataIndex: 'id',
            key: '5',
            render: (applicationID, application) => (
                <React.Fragment>
                    {application.is_submitted ? renderWinnerButton(applicationID, scholarship, selectWinner) : "Cannot select unsubmitted application"}
                </React.Fragment>
            ),
        };
    
        const columns = [
            {
                title: <b>Full Name</b>,
                dataIndex: 'user',
                key: '1',
                render: (userProfile, application) => {
    
                    return application.user ? `${application.user.first_name} ${application.user.last_name}` :
                        `${application.first_name_code} ${application.last_name_code}`;
                },
                sorter: (a, b) => {
    
                    const aString = a.user ? `${a.user.first_name} ${a.user.last_name}` : `${a.first_name_code} ${a.last_name_code}`;
                    const bString = b.user ? `${b.user.first_name} ${b.user.last_name}` : `${b.first_name_code} ${b.last_name_code}`;
                    return aString.localeCompare(bString);
                },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: <b>Application</b>,
                dataIndex: 'id',
                key: '2',
                render: (id, application) => (
                    <React.Fragment>
                        {application.is_winner && <><Tag color="green">Winner</Tag>{' '}</>}
                        {application.is_submitted ? <Link to={`/application/${application.id}`}>View</Link> : "Cannot view unsubmitted application"}
                    </React.Fragment>
                ),
            },
            {
                title: <div>
                    <b>Average Score </b>
                    {!showScores && <p>Click "Show Scores" to see reviewer scores</p>}
                </div>,
                dataIndex: 'average_user_score',
                key: 'average_user_score',
                filters: possibleScoresFilter,
                onFilter: (value, application) => application.average_user_score === null ? value === application.average_user_score : value === Number.parseInt(application.average_user_score),
                sorter: (a, b) => {
                    if (!a.average_user_score) {
                        return -1;
                    }
                    else if (!b.average_user_score) {
                        return 1;
                    }
    
                    return a.average_user_score - b.average_user_score;
                },
                sortDirections: ['descend', 'ascend'],
                render: (average_user_score, application) => (
                    <>
                        {showScores ? average_user_score : null}
                    </>
                )
            },
            {
                title: <div>
                    <b>Reviewer Scores </b>
                    {!showScores && <p>Click "Show Scores" to see reviewer scores</p>}
                </div>,
                dataIndex: 'user_scores',
                filters: assignedReviewersFilter,
                onFilter: (value, application) => getApplicationUsernamesByAttribute(application, "user_scores").includes(value),
                key: '3',
                // Could either use userScores or application.user_scores, they're the same.
                render: (userScores, application) => (
                    <React.Fragment>
                        {application.user_scores && Object.keys(application.user_scores).length > 0 &&
    
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>Score</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(application.user_scores).map(scorerId => {
                                        return (
                                            <tr key={scorerId}>
                                                <td>{application.user_scores[scorerId].user ?
                                                    <UserProfilePreview userProfile={application.user_scores[scorerId].user} /> :
                                                    application.user_scores[scorerId].user_id}
                                                </td>
                                                <td>{showScores  && application.user_scores[scorerId].score}</td>
                                                <td style={{whiteSpace: "pre-line"}}>
                                                    {showScores  && application.user_scores[scorerId].notes}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {maxApplicationScoreDifference(application.user_scores) >= maxReviewerScoreDifference &&
                                        <Alert message="This application has a high score variance." type="warning" showIcon />}
                                </tbody>
                            </table>}
                    </React.Fragment>
                ),
            },
            {
                title: <b>Max Score Difference</b>,
                dataIndex: 'user_scores',
                key: '7',
                render: (userScores, application) => (
                    <>
                        {showScores &&
                            maxApplicationScoreDifference(application.user_scores)}
                    </>
                ),
                sorter: (a, b) => {
                    if (!a.user_scores) {
                        return -1;
                    }
                    else if (!b.user_scores) {
                        return 1;
                    }
    
                    return maxApplicationScoreDifference(a.user_scores) - maxApplicationScoreDifference(b.user_scores);
                },
            },
            {
                title: <b>Assigned Reviewers</b>,
                dataIndex: 'assigned_reviewers',
                key: '4',
                filters: assignedReviewersFilter,
                onFilter: (value, application) => getApplicationUsernamesByAttribute(application, "assigned_reviewers").includes(value),
                render: (reviewers, application) => (
                    <>
                        {reviewers &&
                            reviewers.map(reviewer => (
                                <div key={reviewer.user}>
                                    <UserProfilePreview userProfile={reviewer} linkProfile={true} />
                                    <hr />
                                </div>
                            ))}
                        {application.assigned_reviewers?.length < allReviewers.length &&
                            assignReviewerButton(application, allReviewers)}
                    </>
                ),
            }
        ];
    
        if (isScholarshipOwner) {
            columns.push(selectWinnerColumn);
        }
    
        return (<>
            <Button
                onClick={() => this.setShowScores(!showScores)}
                className="mb-3">
                {showScores ? "Hide " : "Show "} Scores
        </Button>
    
            <CSVLink data={applicationsAsCSV}
                filename={`${slugify(scholarship.name)}-applications.csv`}
                style={{ "float": "right" }}>
                Download as CSV
        </CSVLink>
            <Table columns={columns} dataSource={applications} rowKey="id" />
        </>
        );

    }
}

const todayDate = new Date().toISOString();
export const renderWinnerButton = (applicationID, scholarship, selectWinner) => {
    const confirmText = "Are you sure you want to pick this winner? You will not be able to undo this action.";

    if (scholarship.is_winner_selected) {
        return (
            <p>
                Winner has been selected
            </p>
        )
    }

    if (todayDate < scholarship.deadline) {
        return (
            <p>
                You can pick a winner after the deadline has passed
            </p>
        )
    }

    return (
        <Popconfirm placement="topLeft" title={confirmText} onConfirm={() => selectWinner(applicationID, scholarship)} okText="Yes" cancelText="No">
            <Button className="btn-success">
                Select Winner...
            </Button>
        </Popconfirm>
    )
};
export const getApplicationUsernamesByAttribute = (application, attributeName="assigned_reviewers") => {
    let usernames = [];
    const { assigned_reviewers, user_scores } = application;
    if (assigned_reviewers && attributeName === "assigned_reviewers") {
        usernames = assigned_reviewers.map(reviewer => reviewer.username);
    } else if (user_scores && attributeName === "user_scores") {

        for (const userScore of Object.values(user_scores)) {
            if (userScore.user) {
                usernames.push(userScore.user.username)
            }
        }
    } 
    
    return usernames;
}

export const filterApplication = (application) => {
    const { assigned_reviewers } = application;
    if (assigned_reviewers) {
        let usernames = assigned_reviewers.map(reviewer => reviewer.username);
        return usernames;
    } else {
        return []
    }
}