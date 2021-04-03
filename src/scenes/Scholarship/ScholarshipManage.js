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
import AutoCompleteRemoteData from '../../components/AutoCompleteRemoteData';
import { MinusCircleOutlined } from '@ant-design/icons';


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
            invitedCollaborator: null,
            // This is called email, but currently it is for inviting using usernames. This is because
            //  eventually we might switch to using emails.
            applicationTypeToEmail: 'all', // This is only for the modal to email applicants
            reviewersPerApplication: 2,
            isLoadingMessage: null,
            assignReviewerCurrentUser: null,
            emailSubject: "",
            emailBody: "",
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

    selectFinalistOrWinner = (application, scholarship) => {

        if (scholarship.is_finalists_notified) {
            this.selectWinner(application, scholarship);
        } else {
            this.selectFinalist(application, scholarship);
        }
        
    };

    selectWinner = (application, scholarship) => {
        const winners = {winners: application.id};
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
    }

    selectFinalist = (application, scholarship) => {
        this.setState({isLoadingMessage: "Updating application..."});

        ApplicationsAPI
            .selectFinalist(application.id, {is_finalist: true})
            .then((res)=>{
                console.log({res});
                const {scholarship, applications, unsubmitted_applications: unsubmittedApplications} =  res.data;
                this.setState({scholarship, applications, unsubmittedApplications});
            })
            .catch(err => {
                console.log({err});
                this.setState({responseMessage: "There was an error selecting a finalist.\n\n Please message us using the chat icon in the bottom right of your screen."});
            })
            .then(() => {
                this.setState({isLoadingMessage: null});
            })
    }

    emailApplicants = () => {
        const { scholarship, applicationTypeToEmail, emailSubject, emailBody } = this.state;
        const scholarshipID = scholarship.id;
        const postData = {subject: emailSubject, body: emailBody, 'type': applicationTypeToEmail};
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

    updateEmail = event => {
        if (event.target.name === "email-subject") {
            this.setState({emailSubject: event.target.value,});
        } else if (event.target.name === "email-body") {
            this.setState({emailBody: event.target.value,});
        }
        
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
        const { scholarship, invitedCollaborator } = this.state;
        this.setState({isLoadingMessage: "Inviting collaborators..."});
        ScholarshipsAPI
            .inviteCollaborator(scholarship.id, invitedCollaborator.username)
            .then(res => {
                // invites_sent is also in res.data
                const {scholarship} =  res.data;
                this.setState({scholarship});
                this.setState({responseMessage: `${invitedCollaborator.username} has been sent an invite email.`});
                this.setState({invitedCollaborator: null});
            })
            .catch(err => {
                console.log({err});
                const { response_message } = err.response.data;
                if (response_message) {
                    this.setState({responseMessage: response_message});
                } else {
                    this.setState({responseMessage: `There was an error inviting ${invitedCollaborator}.\n\n Please message us using the chat icon in the bottom right of your screen.`})
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

    confirmFinalists = () => {
        const { scholarship } = this.state;
        this.setState({isLoadingMessage: "Notifying finalists and non-finalists..."});

        ScholarshipsAPI
            .notifyApplicantsFinalistsSelected(scholarship.id, )
            .then(res=> {
                const {scholarship, applications, unsubmitted_applications: unsubmittedApplications} =  res.data;
                const responseMessage = `Scholarship finalists and non-finalists have been notified.`;

                this.setState({scholarship, applications, unsubmittedApplications, responseMessage});
            })
            .catch(err=>{
                console.log({err});
                const { response_message } = err.response.data;
                if (response_message) {
                    this.setState({responseMessage: response_message});
                } else {
                    this.setState({responseMessage: "There was an error notifying applicants.\n\n Please message us using the chat icon in the bottom right of your screen."});
                }
            })
            .then(() => {
                this.setState({isLoadingMessage: null});
            });
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
                        submitText={"Add Reviewer..."}
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
             reviewersPerApplication, isLoadingMessage, emailSubject, emailBody, invitedCollaborator } = this.state;

        const { location: { pathname } } = this.props;
        const todayDate = new Date().toISOString();
        const { TextArea } = Input;
        // const confirmText = "Are you sure you want to unsubmit all submitted applications? This action cannot be undone.";
        
        let dateFinalistsNotified;

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


        if (scholarship.finalists_notified_date) {
            dateFinalistsNotified = new Date(scholarship.finalists_notified_date);
            dateFinalistsNotified =  (<div className="text-muted">
                Finalists notified on {dateFinalistsNotified.toDateString()}{' '}
                {dateFinalistsNotified.toLocaleTimeString()}
            </div>)
        } 

        const allApplications = [...applications, ...unsubmittedApplications];
        const applicationOptions = [
            { label: 'All', value: 'all' },
            { label: 'Submitted', value: 'submitted' },
            { label: 'Unsubmitted', value: 'unsubmitted' },
            { label: 'Exclude Winners', value: 'exclude_winners' },
            { label: 'Finalists Only', value: 'finalists' },
            { label: 'Non Winner finalists', value: 'non_winner_finalists' }
        ];

        let inviteCollaboratorModalBody = (
            <>
            <AutoCompleteRemoteData placeholder={"Collaborator's username or name..."}
                                    onSelect={(userProfile)=>{this.setState({invitedCollaborator: userProfile})}}
                                    type="user" />

                {invitedCollaborator && 
                <div className="my-2">
                    Pending invite: <br/>
                    <UserProfilePreview userProfile={invitedCollaborator} />
                    
                    <MinusCircleOutlined
                        style={{
                            fontSize: "30px",
                        }}
                        onClick={()=>{
                            this.setState({invitedCollaborator: null})
                        }}
                    />
                </div>
                }
            </>
        )
        let isScholarshipOwner = userProfile.user === scholarship.owner

        let emailApplicantsModalBody = (
            <>
                <Input name='email-subject' 
                       value={emailSubject} 
                       onChange={this.updateEmail} className="mb-2" placeholder={"Email subject..."}/>
                <TextArea name='email-body' value={emailBody} 
                                            onChange={this.updateEmail} rows={6} placeholder={"Email body..."}/>
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

                {isScholarshipOwner &&
                <>

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
                    <br />
                    {/*Only allow the scholarship owner to see the invite button. May want to be changed in the future.*/}
                    <ButtonModal
                        showModalButtonSize={"large"}
                        showModalText={"Invite Collaborator..."}
                        modalTitle={"Invite Collaborator"}
                        modalBody={inviteCollaboratorModalBody}
                        submitText={"Send Invite"}
                        onSubmit={this.inviteCollaborator}
                        disabled={isLoadingMessage || scholarship.is_winner_selected}
                    />
                    <br />
                    <ButtonModal
                        showModalButtonSize={"large"}
                        showModalText={"Auto Assign Reviewers..."}
                        modalTitle={"Auto Assign Reviewers"}
                        modalBody={autoAssignReviewersModalBody}
                        submitText={"Confirm Auto Assigning"}
                        onSubmit={this.autoAssignReviewers}
                        disabled={isLoadingMessage || scholarship.is_winner_selected}
                    />
                    {todayDate > scholarship.deadline && !scholarship.is_finalists_notified && 
                    <>
                        <br/>
                        <Popconfirm onConfirm={this.confirmFinalists} disabled={isLoadingMessage}
                        title="Are you sure? An email will be sent to all finalists and non-finalists."
                        placement="right">
                            <Button type="primary" size="large" disabled={isLoadingMessage}>
                                Confirm Finalists...
                            </Button>
                        </Popconfirm>
                        <br/>
                    </>
                    }
                    {dateFinalistsNotified && 
                        <>
                            <br/>
                            {dateFinalistsNotified}
                        </>
                    }
                                    {/*    <Popconfirm placement="right"*/}
                {/*                title={confirmText}*/}
                {/*                onConfirm={() => this.unSubmitApplications()}*/}
                {/*                okText="Yes"*/}
                {/*                cancelText="No">*/}
                {/*        <Button type="primary" size={"large"} danger>*/}
                {/*            Un-Submit all Applications*/}
                {/*        </Button>*/}
                {/*    </Popconfirm>*/}
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
                                   selectFinalistOrWinner={this.selectFinalistOrWinner}
                                   isScholarshipOwner={isScholarshipOwner}
                                   assignReviewerButton={this.assignReviewerButton}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipManage);