import React, { useState } from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Alert, Button, Input, InputNumber, Popconfirm, Radio, Table, Tag} from "antd";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import {BlindApplicationsExplanationMessage, WINNER_SELECTED_MESSAGE} from "../../models/Scholarship";
import ButtonModal from "../../components/ButtonModal";
import {UserProfilePreview} from "../../components/ReferredByInput";

class ScholarshipManage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scholarship: null,
            applications: null,
            unsubmittedApplications: null,
            isLoadingApplications: false,
            responseMessage: null,
            inviteCollaboratorEmail: '',
            // This is called email, but currently it is for inviting using usernames. This is because
            //  eventually we might switch to using emails.
            applicationTypeToEmail: 'all', // This is only for the modal to email applicants
            reviewersPerApplication: 2,
            isLoadingMessage: null,
        }
    }

    componentDidMount() {
        const { userProfile } = this.props;

        if (userProfile) {
            this.getScholarshipApplications();
        }
    }

    getScholarshipApplications = () => {
        const { match : { params : { scholarshipID }} } = this.props;

        this.setState({isLoadingApplications: true});
        ScholarshipsAPI.getApplications(scholarshipID)
            .then(res => {
                const {scholarship, applications, unsubmitted_applications: unsubmittedApplications} =  res.data;
                this.setState({scholarship, applications, unsubmittedApplications});
                if (scholarship.is_winner_selected) {
                    this.setState({responseMessage: WINNER_SELECTED_MESSAGE});
                }
            })
            .finally(() => {
                this.setState({isLoadingApplications: false});
            });
    };

    selectWinner = (applicationID, scholarship) => {

        const winners = {winners: applicationID};
        const scholarshipID = scholarship.id;
        this.setState({isLoadingMessage: "Messaging winners..."});
        ScholarshipsAPI
            .selectWinners(scholarshipID, winners)
            .then((res)=>{
                const {scholarship, applications, unsubmitted_applications: unsubmittedApplications} =  res.data;
                this.setState({scholarship, applications, unsubmittedApplications});
                this.setState({responseMessage: WINNER_SELECTED_MESSAGE});
            })
            .catch(err => {
                console.log({err});
                this.setState({responseMessage: "There was an error selecting a winner.\n\n Please message us using the chat icon in the bottom right of your screen."});
            })
            .then(() => {
                this.setState({isLoadingMessage: null});
            })
    };

    emailApplicants = () => {
        const { scholarship, applicationTypeToEmail } = this.state;
        const scholarshipID = scholarship.id;
        const subject = document.getElementById('email-subject').value;
        const body = document.getElementById('email-body').value;
        const postData = {'subject': subject, 'body': body, 'type': applicationTypeToEmail};
        this.setState({isLoadingMessage: "Emailing applicants..."});

        ScholarshipsAPI
            .emailApplicants(scholarshipID, postData)
            .then(res=> {
                const {scholarship, applications, unsubmitted_applications: unsubmittedApplications} =  res.data;
                this.setState({scholarship, applications, unsubmittedApplications});
                this.setState({responseMessage: "All applicants have been emailed!"});
            })
            .catch(err=>{
                console.log({err});
                this.setState({responseMessage: "There was an error emailing the applicants.\n\n Please message us using the chat icon in the bottom right of your screen."});
            })
            .then(() => {
                this.setState({isLoadingMessage: null});
            });
    };

    onRadioClick = e => {
        this.setState({applicationTypeToEmail: e.target.value,});
    };

    unSubmitApplications = () => {
        const { scholarship } = this.state;
        const scholarshipID = scholarship.id;
        this.setState({isLoadingMessage: "Unsubmitting applications..."});
        ScholarshipsAPI
            .unSubmitApplications(scholarshipID, {})
            .then(res=> {
                const {scholarship, applications, unsubmitted_applications: unsubmittedApplications} =  res.data;
                this.setState({scholarship, applications, unsubmittedApplications});
                this.setState({responseMessage: "All applications have been unsubmitted."})
            })
            .catch(err=>{
                console.log({err});
                this.setState({responseMessage: "There was an error unsubmitting the applications.\n\n Please message us using the chat icon in the bottom right of your screen."});
            })
            .then(() => {
                this.setState({isLoadingMessage: null});
            });
    };

    inviteCollaborator = () => {
        const { scholarship, inviteCollaboratorEmail } = this.state;
        this.setState({isLoadingMessage: "Inviting collaborators..."});
        ScholarshipsAPI
            .inviteCollaborator(scholarship.id, inviteCollaboratorEmail)
            .then(res => {
                // invites_sent is also in res.data
                const {scholarship} =  res.data;
                this.setState({scholarship});
                this.setState({responseMessage: `${inviteCollaboratorEmail} has been sent an invite email.`})
            })
            .catch(err => {
                console.log({err});
                this.setState({responseMessage: `There was an error inviting ${inviteCollaboratorEmail}.\n\n Please message us using the chat icon in the bottom right of your screen.`})
            })
            .then(() => {
                this.setState({isLoadingMessage: null});
            });
    }

    autoAssignReviewers = () => {
        const { scholarship, reviewersPerApplication } = this.state;
        this.setState({isLoadingMessage: "Auto assigning reviewers..."});

        ScholarshipsAPI
            .assignReviewers(scholarship.id, reviewersPerApplication)
            .then(res=> {
                const {scholarship, applications, unsubmitted_applications: unsubmittedApplications} =  res.data;
                const responseMessage = `Scholarship reviewers have been assigned.`;

                this.setState({scholarship, applications, unsubmittedApplications, responseMessage});
            })
            .catch(err=>{
                console.log({err});
                this.setState({responseMessage: "There was an error assigning reviewers.\n\n Please message us using the chat icon in the bottom right of your screen."});
            })
            .then(() => {
                this.setState({isLoadingMessage: null});
            });

    }

    updateReviewersPerApplication = (reviewersPerApplication) => {
        this.setState({reviewersPerApplication});
    }

    render() {
        const { userProfile } = this.props;
        const { scholarship, applications, isLoadingApplications,
            unsubmittedApplications, responseMessage, applicationTypeToEmail,
             reviewersPerApplication, isLoadingMessage } = this.state;
        const { TextArea } = Input;
        // const confirmText = "Are you sure you want to unsubmit all submitted applications? This action cannot be undone.";

        if (!userProfile) {
            return (
                <div className="container mt-5">
                    <h2><Link to={`/login`}>Log In</Link> to manage scholarships</h2>
                </div>
            )
        }

        else if (isLoadingApplications) {
            return (<Loading title={`Loading Applications`} className='mt-3' />)
        }
        else if (!scholarship) {
            return (
                <h1>
                  Scholarship Not Found
                </h1>
            )
        }

        const allApplications = [...applications, ...unsubmittedApplications];
        const applicationOptions = [
            { label: 'All', value: 'all' },
            { label: 'Submitted', value: 'submitted' },
            { label: 'Unsubmitted', value: 'unsubmitted' },
            { label: 'Exclude Winners', value: 'exclude_winners' },
            { label: 'Finalists Only', value: 'finalists' }
        ];

        let inviteCollaboratorModalBody = (
                <Input
                    placeholder={"Collaborator's Atila username..."}
                    onChange={(e)=>{this.setState({inviteCollaboratorEmail: e.target.value})}}
                />
        )
        let isScholarshipOwner = userProfile.user === scholarship.owner

        let emailApplicantsModalBody = (
            <>
                <Input id='email-subject' className="mb-2" placeholder={"Email subject..."}/>
                <TextArea id='email-body' rows={6} placeholder={"Email body..."}/>
                <br />
                <br />
                <b>Which applications would you like to send this email to?</b>
                <br />
                <Radio.Group
                    options={applicationOptions}
                    onChange={this.onRadioClick}
                    value={applicationTypeToEmail}
                    optionType="button"
                    buttonStyle="solid"
                />
            </>
        )

        const { collaborators, owner_detail } = scholarship;

        const reviewers = [owner_detail, ...collaborators]

        let autoAssignReviewersModalBody = (
            <>
                <h6>Number of reviewers per application</h6>
                <InputNumber value={reviewersPerApplication}
                             min={1}
                             max={reviewers.length}
                             step={1}
                             onChange={this.updateReviewersPerApplication} />
                {(reviewersPerApplication > reviewers.length || reviewersPerApplication < 1) &&
                <p style={{"color": "red"}}>
                    Reviewers per application must be {  reviewersPerApplication < 1 ?
                    "greater than 0" : `less than or equal to the number of reviewers (${reviewers.length})`}
                </p>
                }
            </>
        )

        let reviewersPreview = reviewers.map(reviewer => (
            <div style={{"marginRight": "3%"}} key={reviewer.user}>
                <UserProfilePreview userProfile={reviewer} linkProfile={true}/>
            </div>
        ))

        return (
            <div className="container mt-5">
                <h2>
                    Submitted Applications: {applications.length} <br/>
                    Un-Submitted Applications (Under Draft): {unsubmittedApplications.length}
                </h2>
                <Link to={`/scholarship/edit/${scholarship.slug}`} className="text-center">
                    Edit Scholarship
                </Link>
                <br/>
                <Link to={`/scholarship/${scholarship.slug}`} className="text-center">
                    View {scholarship.name}
                </Link>
                <br />
                <br />

                <ButtonModal
                    showModalButtonSize={"large"}
                    showModalText={"Email Applicants..."}
                    modalTitle={"Draft Email"}
                    modalBody={emailApplicantsModalBody}
                    submitText={"Send Email..."}
                    onSubmit={this.emailApplicants}
                    addPopConfirm={true}
                    disabled={isLoadingMessage}
                    popConfirmText={"Are you sure you want to send email?"}
                />

                {isScholarshipOwner &&
                <>
                    <br />
                    {/*TEMPORARILY only allow the scholarship owner to see the invite button. Until the serializer
                    for scholarship collaborators has been done.*/}
                    <ButtonModal
                        showModalButtonSize={"large"}
                        showModalText={"Invite Collaborator"}
                        modalTitle={"Invite Collaborator"}
                        modalBody={inviteCollaboratorModalBody}
                        submitText={"Send Invite"}
                        onSubmit={this.inviteCollaborator}
                        disabled={isLoadingMessage}
                    />
                    <br />
                    <ButtonModal
                        showModalButtonSize={"large"}
                        showModalText={"Auto Assign Reviewers"}
                        modalTitle={"Auto Assign Reviewers"}
                        modalBody={autoAssignReviewersModalBody}
                        submitText={"Confirm Auto Assigning"}
                        onSubmit={this.autoAssignReviewers}
                        disabled={isLoadingMessage}
                    />
                </>
                }
                {isLoadingMessage && 
                <Loading title={isLoadingMessage} className='mt-3' />
                }

                <br />
                <h5>Reviewers</h5>
                {reviewersPreview}
                <br />

                {/*
                    Todo replace un-submit applications with ability to resubmit:
                        https://github.com/ademidun/atila-client-web-app/issues/279
                */}
                {/*{userProfile.is_atila_admin &&*/}
                {/*<>*/}
                {/*    <Popconfirm placement="right"*/}
                {/*                title={confirmText}*/}
                {/*                onConfirm={() => this.unSubmitApplications()}*/}
                {/*                okText="Yes"*/}
                {/*                cancelText="No">*/}
                {/*        <Button type="primary" size={"large"} danger>*/}
                {/*            Un-Submit all Applications*/}
                {/*        </Button>*/}
                {/*    </Popconfirm>*/}
                {/*    <br />*/}
                {/*    <br />*/}
                {/*</>*/}
                {/*}*/}

                {responseMessage &&
                <Alert
                    message={responseMessage}
                    className="mb-3"
                    style={{maxWidth: '300px', whiteSpace: "pre-line"}}
                />
                }

                {scholarship.is_blind_applications && <BlindApplicationsExplanationMessage />}
                <ApplicationsTable applications={allApplications} scholarship={scholarship} selectWinner={this.selectWinner}/>
            </div>
        )
    }
}

function ApplicationsTable({ applications, scholarship, selectWinner }){
    const { collaborators, owner_detail } = scholarship;

    let allReviewers = [...collaborators, owner_detail];
    // Automatically show the scores by default if the winner has been selected.
    const [showScores, setShowScores] = useState(scholarship.is_winner_selected);

    let assignedReviewersFilter = allReviewers.map(collaborator => {
        return {'text': collaborator.username,
                'value': collaborator.username}
    })

    const possibleScores = [null, ...Array(11).keys()];

    const possibleScoresFilter = possibleScores.map(possibleScore => {
        return {
                'text': possibleScore === null ? "None" : possibleScore,
                'value': possibleScore
            }
    })

    const columns = [
        {
            title: <b>Full Name</b>,
            dataIndex: 'user',
            key: '1',
            render: (userProfile, application) => {

                return application.user ? `${application.user.first_name} ${application.user.last_name}` :
                    `${application.first_name_code} ${application.last_name_code}`;
            },
            sorter: (a, b) =>{

                const aString = a.user ? `${a.user.first_name} ${a.user.last_name}` : `${a.first_name_code} ${a.last_name_code}`;
                const bString = b.user? `${b.user.first_name} ${b.user.last_name}` : `${b.first_name_code} ${b.last_name_code}`;
                return aString.localeCompare(bString)
            } ,
            sortDirections: ['ascend' , 'descend'],
        },
        {
            title: <b>Application</b>,
            dataIndex: 'id',
            key: '2',
            render: (id, application) => (
                <React.Fragment>
                    {application.is_winner && <><Tag color="green">Winner</Tag>{' '}</>}
                    {application.is_submitted? <Link to={`/application/${application.id}`}>View</Link> : "Cannot view unsubmitted application"}
                </React.Fragment>
            ),
        },
        {
            title: <p>
            <b>Average Score </b>
            {!showScores && <p>Click "Show Scores" to see reviewer scores</p>}
            </p>,
            dataIndex: 'average_user_score',
            key: 'average_user_score',
            filters: possibleScoresFilter,
            onFilter: (value, application) => application.average_user_score === null ?  value === application.average_user_score : value === Number.parseInt(application.average_user_score),
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
                    {showScores ? average_user_score : null }
                </>
            )
        },
        {
            title: <p>
            <b>Reviewer Scores </b>
            {!showScores && <p>Click "Show Scores" to see reviewer scores</p>}
            </p>,
            dataIndex: 'user_scores',
            key: '3',
            // Could either use userScores or application.user_scores, they're the same.
            render: (userScores, application) => (
                <React.Fragment>
                    {showScores && application.user_scores && Object.keys(application.user_scores).length > 0 &&

                    <table className="table">
                        <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                            {Object.keys(application.user_scores).map(scorerId => {
                                return (
                                    <tr key={scorerId}>
                                        <td>{application.user_scores[scorerId].user ?
                                            <UserProfilePreview userProfile={application.user_scores[scorerId].user} /> :
                                            application.user_scores[scorerId].user_id  
                                            } 
                                        </td>
                                        <td>{application.user_scores[scorerId].score}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    
                    }
                </React.Fragment>
            ),
        },
        {
            title: <b>Assigned Reviewers</b>,
            dataIndex: 'assigned_reviewers',
            key: '4',
            filters: assignedReviewersFilter,
            onFilter: (value, application) => applicationReviewersUsernames(application).includes(value),
            render: (reviewers, application) => {
                if (reviewers) {
                    return reviewers.map(reviewer => (
                        <div key={reviewer.user}>
                        <UserProfilePreview userProfile={reviewer} linkProfile={true}/>
                        <hr/>
                        </div>
                    ))
                }
            },
        },
        {
            title: <b>Select Winner</b>,
            dataIndex: 'id',
            key: '5',
            render: (applicationID, application) => (
                <React.Fragment>
                    {application.is_submitted? renderWinnerButton(applicationID, scholarship, selectWinner) : "Cannot select unsubmitted application"}
                </React.Fragment>
            ),
        },
    ];

    return (<>
    <Button 
    onClick={() => setShowScores(!showScores)}
    className="mb-3">
        {showScores ? "Hide " : "Show "} Scores
    </Button>
    <Table columns={columns} dataSource={applications} rowKey="id" />
    </>
    )
}

const todayDate = new Date().toISOString();
const renderWinnerButton = (applicationID, scholarship, selectWinner) => {
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

const applicationReviewersUsernames = application => {
    const { assigned_reviewers } = application;
    if (assigned_reviewers) {
        let usernames = assigned_reviewers.map(reviewer => reviewer.username);
        return usernames;
    } else {
        return []
    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipManage);