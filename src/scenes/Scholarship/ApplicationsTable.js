import React from 'react';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Alert, Button, Table, Tag, Popconfirm, Popover } from "antd";
import { UserProfilePreview } from "../../components/ReferredByInput";
import { formatCurrency, slugify } from '../../services/utils';
import { CSVLink } from 'react-csv';
import { convertApplicationsToCSVFormat, maxApplicationScoreDifference } from '../Application/ApplicationUtils';
import { ApplicationsSearch, ApplicationPreview } from '../Application/ApplicationsSearch';
import EmailModal from "../../components/EmailModal";
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { ApplicationResponseDisplay } from '../Application/ApplicationDetail/ApplicationDetailView';


// Show a warning
export const maxReviewerScoreDifference = 2.1;

const todayDate = new Date().toISOString();


export const renderFinalistOrWinnerButton = (application, scholarship, selectFinalistOrWinner, awards) => {

    let finalistOrWinnerText = scholarship.is_finalists_notified ? "winner" : "finalist"
    let confirmText = `Are you sure you want to pick this ${finalistOrWinnerText}?`;
    if (scholarship.is_finalists_notified) {
        confirmText = confirmText + " You will not be able to undo this action.";
    }

    const deadlineHasPassed = scholarship.deadline < todayDate;
    if (!deadlineHasPassed) {
        return (
            <p>
                You can pick a winner after the deadline has passed
            </p>
        )
    }

    if (application.is_winner) {
        let application_award = awards.find(award => application.id === award?.recipient?.id)
        return (
            <div>
                <div className="mb-2"><Tag color="green">Winner</Tag></div>
                This application won {formatCurrency(application_award.funding_amount, true)}.
            </div>
        )
    }

    if (scholarship.is_winner_selected) {
        return (
            <p>
                All Winners have been selected.
            </p>
        )
    }


    if (application.is_finalist && !scholarship.is_finalists_notified) {
        return (
            <>
                <p>
                    This finalist has been selected. Confirm finalists before you select a winner.
                </p>
                <Popconfirm placement="topLeft" 
                    title={"Confirm de-selecting of finalist?"} 
                    onConfirm={() => selectFinalistOrWinner(application, scholarship)} 
                    okText="Yes" 
                    cancelText="No">
                    <Button danger>
                        Unselect Finalist...
                    </Button>
                </Popconfirm>
            </>
        )
    }
    if (!application.is_finalist && scholarship.is_finalists_notified) {
        return (
            <p>
                Only finalists can be selected as a winner
            </p>
        )
    }

    if (!scholarship.is_finalists_notified) {
        return (
            <Popconfirm placement="topLeft" 
                        title={confirmText} 
                        onConfirm={() => selectFinalistOrWinner(application, scholarship)} 
                        okText="Yes" cancelText="No">
                <Button className="btn-success">
                    Select Finalist...
                </Button>
            </Popconfirm>
        )
    }

    const awardOptions = awards.filter(award => !award.recipient).map(award =>        (
            <Popconfirm placement="topLeft" 
                        title={confirmText}
                        key={award.id} 
                        onConfirm={() => selectFinalistOrWinner(application, scholarship, award.id)} 
                        okText="Yes" cancelText="No">
                <Button>{formatCurrency(award.funding_amount, true)}</Button>
            </Popconfirm>
        )
    )

    return (
        <Popover trigger={"click"} title={<b>Choose Award</b>} content={awardOptions} placement={"top"}>
                <Button className="btn-success">
                    Select Winner...
                </Button>
        </Popover>
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


class ApplicationsTable extends  React.Component {
    constructor(props) {
        super(props);

        const { scholarship, applications } = this.props;

        this.state = {
            // Automatically show the scores by default if the winner has been selected.
            showScores: scholarship.is_winner_selected,
            allApplications: applications,
            filteredApplications: applications,
            searchTerm: "",
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (state.allApplications !== props.applications) {
          // If the applications props from parent component changes,
          // reset the visible applications and search term so that the new information
          // is shown in the UI.
          return {
            allApplications: props.applications,
            filteredApplications: props.applications,
            searchTerm: "",
          }
        }
        return null
    }

    setShowScores(showScores) {
        this.setState({showScores});
    }

    filterApplications(filteredApplications, searchTerm){
        this.setState({filteredApplications, searchTerm});
    }

    getViewResponsesDataSource = () => {
        const { filteredApplications } = this.state;
        const { scholarship } = this.props;

        const { specific_questions } = scholarship;

        const columns = []

        for (let questionInfo of specific_questions) {
            
            let column = {
                title: <b>{questionInfo.question}</b>,
                dataIndex: questionInfo.key,
                key: questionInfo.key,
                render: (response, application) => {
                    console.log({response, application})

                    return response && response.key ? <ApplicationResponseDisplay 
                    question={response} 
                    responses={{[response.key]: response.response}} 
                    previewMode={true} /> : null
                }
            };
            if(["single_select", "multi_select"].includes(questionInfo.type)) {
                const columnFilterOptions = {
                    filters: questionInfo.options.map(option => ({
                        text: option,
                        value: option
                    })),
                      filterMode: 'tree',
                      filterSearch: true,
                      onFilter: (filterValue, application) => {
                        
                        console.log({filterValue, application, });
                        if (!application?.scholarship_responses?.[questionInfo.key]?.response) {
                            return false
                        }
                        return application?.scholarship_responses[questionInfo.key]?.response?.includes(filterValue);
                      },
                      width: '30%',
                };
                column = {
                    ...column,
                    ...columnFilterOptions
                }
            }
            console.log("question.type", questionInfo.type, column, questionInfo);
            console.log('["single_select", "multi_select"].includes(question.type)', ["single_select", "multi_select"].includes(questionInfo.type));
            columns.push(column);
        }

        let applicationResponses = filteredApplications.map(application => {
            let {scholarship_responses} = application;
            let applicationWithResponses = {...application}
            for (let questionInfo of specific_questions) {
                applicationWithResponses[questionInfo.key] = scholarship_responses? scholarship_responses[questionInfo.key] : "";
            }
            return applicationWithResponses
        })

        if (filteredApplications.length === 0) {
            return [columns, applicationResponses]
        }
        return [columns, applicationResponses]
    }

    render () {

        const { scholarship, selectFinalistOrWinner, isScholarshipOwner, assignReviewerButton,
            awards, loggedInUserProfile, viewApplicationResponses } = this.props;
        const { collaborators, owner_detail } = scholarship;
        const { showScores, allApplications, filteredApplications, searchTerm } = this.state;

    const deadlineHasPassed = scholarship.deadline < todayDate;
    
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

        let applicationsAsCSV = convertApplicationsToCSVFormat(filteredApplications);
    
        const selectWinnerColumn = {
            title: <b>Select {scholarship.is_finalists_notified ? " Winner" : " Finalists"}</b>,
            dataIndex: 'id',
            key: '5',
            render: (applicationID, application) => (
                <React.Fragment>
                    {application.is_submitted ? renderFinalistOrWinnerButton(application, scholarship, selectFinalistOrWinner, awards) : "Cannot select unsubmitted application"}
                </React.Fragment>
            ),
        };
        const checkIcon = (<CheckCircleTwoTone twoToneColor="#52c41a" />);

        const closeIcon = (<CloseCircleTwoTone twoToneColor="#FF0000" />);

        let columns = [
            {
                title: <b>Full Name</b>,
                dataIndex: 'user',
                key: '1',
                render: (userProfile, application) => {
                    let displayName = application.user ? `${application.user.first_name} ${application.user.last_name}` :
                        `${application.first_name_code} ${application.last_name_code}`

                    return (
                        <>
                            {displayName}

                            {loggedInUserProfile && loggedInUserProfile.is_atila_admin && application.user &&
                            <div className="my-2">
                                <Link to={`/profile/${application.user.username}/admin`}>View Profile (@{application.user.username})</Link>
                            </div>
                            }

                            {application.is_finalist &&
                            <div className="mb-2">
                                Verified proof of enrollment? { userProfile.enrollment_proof_verified ? checkIcon : closeIcon}
                            </div>
                            }

                            <EmailModal scholarship={scholarship}
                                        application={application}
                                        showModalText={"Message Applicant..."}
                                        modalTitle={`Draft Message for ${displayName}`}
                            />
                        </>
                    );
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
                        {application.is_winner && <div className="mb-2"><Tag color="green">Winner</Tag></div>}
                        {!application.is_winner && application.is_finalist && <div className="mb-2"><Tag>Finalist</Tag></div>}
                        {application.is_submitted || deadlineHasPassed ? <Link to={`/application/${application.id}`}>View Application</Link> : "Cannot view unsubmitted application before the deadline"}
                        {loggedInUserProfile && loggedInUserProfile.is_atila_admin &&
                        <div className="my-2">
                            <pre>ID: {id}</pre>
                        </div>
                        }
                        { application.scholarship_responses && Object.values(application.scholarship_responses).length > 0
                        &&
                        <>
                            <ApplicationPreview application={application} searchTerm={searchTerm} />
                        </>
                        }


                    </React.Fragment>
                ),
            },
        ]
        let dataSource = filteredApplications
        const [responsesColumns, responsesDataSource] = this.getViewResponsesDataSource()

        if (viewApplicationResponses) {
            responsesColumns.forEach(column => columns.push(column))
            dataSource = responsesDataSource
        } else {
            let scoreColumns = [
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
                )},
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
            ]

            scoreColumns.forEach(column => columns.push(column))
            if (isScholarshipOwner || loggedInUserProfile.is_atila_admin) {
                columns.push(selectWinnerColumn);
            }
        }

        return (<>
            {/* When the scores are hidden: Popconfirm.onConfirm() will be called.
                When the scores are shown Button.onClick() will be called. Hence the reason we have both  */}
            <Popconfirm onConfirm={() => this.setShowScores(!showScores)}
                        disabled={showScores}
                        title="Are you sure? You will be able to see the scores of each application."
                        placement="right">
                <Button
                    onClick={() => {
                        if(showScores) {
                            this.setShowScores(!showScores)
                        }
                    }}
                    className="mb-3">
                    {showScores ? "Hide " : "Show "} Scores...
                </Button>
            </Popconfirm>
        <ApplicationsSearch applications={allApplications} updateSearch={(filtered, searchTerm) => this.filterApplications(filtered, searchTerm)} />
            <CSVLink data={applicationsAsCSV}
                filename={`${slugify(scholarship.name)}-applications.csv`}
                style={{ "float": "right" }}>
                Download as CSV
        </CSVLink>
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
        </>
        );

    }
}

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};

ApplicationsTable.propTypes = {
    applications: PropTypes.array,
    scholarship: PropTypes.shape({}),
    awards: PropTypes.array,
    selectFinalistOrWinner: PropTypes.func,
    isScholarshipOwner: PropTypes.bool,
    assignReviewerButton: PropTypes.elementType,
    loggedInUserProfile: PropTypes.shape({}),
    viewApplicationResponses: PropTypes.bool
};

export default connect(mapStateToProps)(ApplicationsTable);