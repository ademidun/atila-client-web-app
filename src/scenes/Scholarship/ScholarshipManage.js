import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Alert, Button, Input, InputNumber, Popconfirm, Radio, Tag} from "antd";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import {BlindApplicationsExplanationMessage, WINNER_SELECTED_MESSAGE} from "../../models/Scholarship";
import ButtonModal from "../../components/ButtonModal";
import {UserProfilePreview} from "../../components/ReferredByInput";
import HelmetSeo, {defaultSeoContent} from '../../components/HelmetSeo';
import ApplicationsAPI from "../../services/ApplicationsAPI";
import { ApplicationsTable } from './ApplicationsTable';

// Show a warning
export const maxReviewerScoreDifference = 3;

class AssignReviewerRadioSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        }
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        }, ()=>{
            const { value } = this.state;
            const { reviewerOptions, updateCurrentReviewer } = this.props;

            let newReviewer = reviewerOptions[value];
            updateCurrentReviewer(newReviewer);
        });
    };

    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        const { value } = this.state;
        const { reviewerOptions } = this.props;

        let reviewerRadioOptions = reviewerOptions.map((reviewer, index) => {
            return (
                <Radio style={radioStyle} value={index}>
                    <UserProfilePreview userProfile={reviewer} />
                </Radio>
            )
        })

        return (
            <Radio.Group onChange={this.onChange} value={value}>
                {reviewerRadioOptions}
            </Radio.Group>
        );
    }
}


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
            assignReviewerCurrentUser: null,
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
                const { response_message } = err.response.data;
                if (response_message) {
                    this.setState({responseMessage: response_message});
                } else {
                    this.setState({responseMessage: `There was an error inviting ${inviteCollaboratorEmail}.\n\n Please message us using the chat icon in the bottom right of your screen.`})
                }
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
                const { response_message } = err.response.data;
                if (response_message) {
                    this.setState({responseMessage: response_message});
                } else {
                    this.setState({responseMessage: "There was an error assigning reviewers.\n\n Please message us using the chat icon in the bottom right of your screen."});
                }
            })
            .then(() => {
                this.setState({isLoadingMessage: null});
            });

    }

    assignReviewer = (application) => {
        const { assignReviewerCurrentUser } = this.state;

        if (!assignReviewerCurrentUser) {
            this.setState({responseMessage: "You must select a reviewer."})
        } else {
            this.setState({isLoadingMessage: "Assigning Reviewer..."});

            ApplicationsAPI
                .assignReviewer(application.id, assignReviewerCurrentUser.user)
                .then(res => {
                    const {scholarship, applications, unsubmitted_applications: unsubmittedApplications} = res.data;
                    const responseMessage = `Reviewer has been assigned.`;

                    this.setState({scholarship, applications, unsubmittedApplications, responseMessage});
                })
                .catch(err => {
                    console.log({err});
                    const {response_message} = err.response.data;
                    if (response_message) {
                        this.setState({responseMessage: response_message});
                    } else {
                        this.setState({responseMessage: "There was an error assigning reviewer.\n\n Please message us using the chat icon in the bottom right of your screen."});
                    }
                })
                .then(() => {
                    this.setState({isLoadingMessage: null});
                });
        }
    }

    updateCurrentReviewer = (newReviewer) => {
        this.setState({assignReviewerCurrentUser: newReviewer});
    }

    assignReviewerButton = (application, allReviewers) => {
        const { scholarship, isLoadingMessage } = this.state;

        if (application.assigned_reviewers) {
            let applicationReviewerIds = application.assigned_reviewers.map(reviewer => reviewer.user.toString())

            function isNotAlreadyReviewer(reviewer) {
                return !applicationReviewerIds.includes(reviewer.user.toString())
            }

            allReviewers = allReviewers.filter(isNotAlreadyReviewer)

            let assignReviewerModalBody = <AssignReviewerRadioSelect reviewerOptions={allReviewers}
                                                                     updateCurrentReviewer={this.updateCurrentReviewer}/>

            return (
                <>
                    <ButtonModal
                        showModalButtonSize={"small"}
                        showModalText={"Assign Reviewer..."}
                        modalTitle={"Choose Reviewer"}
                        modalBody={assignReviewerModalBody}
                        submitText={"Add Reviewer"}
                        onSubmit={() => {
                            this.assignReviewer(application)
                        }}
                        addPopConfirm={true}
                        disabled={isLoadingMessage || scholarship.is_winner_selected}
                        popConfirmText={"Confirm adding reviewer?"}
                        onShowModal={()=>{this.updateCurrentReviewer(null)}}
                    />
                </>
            )
        } else {
            return null
        }

    }

    updateReviewersPerApplication = (reviewersPerApplication) => {
        this.setState({reviewersPerApplication});
    }

    render() {
        const { userProfile } = this.props;
        const { scholarship, applications, isLoadingApplications,
            unsubmittedApplications, responseMessage, applicationTypeToEmail,
             reviewersPerApplication, isLoadingMessage } = this.state;

        const { location: { pathname } } = this.props;
        const { TextArea } = Input;
        // const confirmText = "Are you sure you want to unsubmit all submitted applications? This action cannot be undone.";

        if (!userProfile) {
            return (
                <div className="container mt-5">
                    <h2>
                        <Link to={`/login?redirect=${pathname}`}>
                        Log In</Link>{' '}
                        to manage scholarships
                    </h2>
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

        let reviewersPreview = reviewers.map((reviewer, index) => (
            <div style={{"marginRight": "3%"}} key={reviewer.user}>
                <UserProfilePreview userProfile={reviewer} linkProfile={true}/>
                {index === 0 && <Tag color={'green'}>OWNER</Tag>}
            </div>
        ))
        const seoContent = {
            ...defaultSeoContent,
            title: `${scholarship.name} application management`
        };

        return (
            <div className="container mt-5">
                <HelmetSeo  content={seoContent}/>
                <h1>
                <Link to={`/scholarship/${scholarship.slug}`} className="text-center">
                    {scholarship.name}
                </Link>
                    {' '}application management
                </h1>
                <h2>
                    Submitted applications: {applications.length} <br/>
                    Un-Submitted applications (under draft): {unsubmittedApplications.length}
                </h2>
                <br />
                <Link to={`/scholarship/edit/${scholarship.slug}`} className="text-center">
                    Edit Scholarship
                </Link>
                <br/>
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
                    {/*Only allow the scholarship owner to see the invite button. May want to be changed in the future.*/}
                    <ButtonModal
                        showModalButtonSize={"large"}
                        showModalText={"Invite Collaborator"}
                        modalTitle={"Invite Collaborator"}
                        modalBody={inviteCollaboratorModalBody}
                        submitText={"Send Invite"}
                        onSubmit={this.inviteCollaborator}
                        disabled={isLoadingMessage || scholarship.is_winner_selected}
                    />
                    <br />
                    <ButtonModal
                        showModalButtonSize={"large"}
                        showModalText={"Auto Assign Reviewers"}
                        modalTitle={"Auto Assign Reviewers"}
                        modalBody={autoAssignReviewersModalBody}
                        submitText={"Confirm Auto Assigning"}
                        onSubmit={this.autoAssignReviewers}
                        disabled={isLoadingMessage || scholarship.is_winner_selected}
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
                <ApplicationsTable applications={allApplications}
                                   scholarship={scholarship}
                                   selectWinner={this.selectWinner}
                                   isScholarshipOwner={isScholarshipOwner}
                                   assignReviewerButton={this.assignReviewerButton}
                />
            </div>
        )
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

export const applicationReviewersUsernames = application => {
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