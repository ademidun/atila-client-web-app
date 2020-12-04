import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Table, Popconfirm, Button, Tag, Alert, Modal, Input, Radio} from "antd";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import {WINNER_SELECTED_MESSAGE} from "../../models/Scholarship";

class ScholarshipManage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scholarship: null,
            applications: null,
            unsubmittedApplications: null,
            isLoadingApplications: false,
            responseMessage: null,
            isModalVisible: false,
            applicationType: 'all'
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
    };

    showModal = () => {
        this.setState({isModalVisible: true});
    };

    emailApplicants = () => {
        const { scholarship, applicationType } = this.state;
        const scholarshipID = scholarship.id
        const subject = document.getElementById('email-subject').value
        const body = document.getElementById('email-body').value
        const postData = {'subject': subject, 'body': body, 'type': applicationType}

        ScholarshipsAPI
            .emailApplicants(scholarshipID, postData)
            .then(res=> {
                const {scholarship, applications, unsubmitted_applications: unsubmittedApplications} =  res.data;
                this.setState({scholarship, applications, unsubmittedApplications});
                this.setState({responseMessage: "All applicants have been emailed!"})
            })
            .catch(err=>{
                console.log({err});
                this.setState({responseMessage: "There was an error emailing the applicants.\n\n Please message us using the chat icon in the bottom right of your screen."});
            })

        this.setState({isModalVisible: false});
    };

    handleModalCancel = () => {
        this.setState({isModalVisible: false});
    };

    onRadioClick = e => {
        this.setState({applicationType: e.target.value,});
    };

    render() {
        const { userProfile } = this.props;
        const { scholarship, applications, isLoadingApplications,
            unsubmittedApplications, responseMessage, isModalVisible, applicationType } = this.state;
        const { TextArea } = Input

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
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const applicationOptions = [
            { label: 'All Applications', value: 'all', style: radioStyle  },
            { label: 'Submitted Applications', value: 'submitted', style: radioStyle },
            { label: 'Unsubmitted Applications', value: 'unsubmitted', style: radioStyle },
        ]

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
                    View Scholarship
                </Link>
                <br />
                <br />

                <Button type="primary" size={"large"} onClick={this.showModal}>
                    Email Applicants
                </Button>
                <Modal
                    title={<Input id='email-subject' placeholder={"Email subject..."}/>}
                    visible={isModalVisible}
                    onOk={()=>{this.emailApplicants()}}
                    onCancel={()=>{this.handleModalCancel()}}
                    okText={"Send Emails"}
                >
                    <TextArea id='email-body' rows={4} placeholder={"Email body..."}/>
                    <br />
                    <br />
                    <b>Which applications would you like to send this email to?</b>
                    <br />
                    <Radio.Group
                        options={applicationOptions}
                        onChange={this.onRadioClick}
                        value={applicationType}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </Modal>

                <br />
                <br />
                {responseMessage &&
                <Alert
                    message={responseMessage}
                    className="mb-3"
                    style={{maxWidth: '300px', whiteSpace: "pre-line"}}
                />
                }
                <ApplicationsTable applications={allApplications} scholarship={scholarship} selectWinner={this.selectWinner}/>
            </div>
        )
    }
}

function ApplicationsTable({ applications, scholarship, selectWinner }){

    const columns = [
        {
            title: <b>Full Name</b>,
            dataIndex: 'user',
            key: '1',
            render: (userProfile) => (userProfile && userProfile.first_name && `${userProfile.first_name} ${userProfile.last_name}`),
            sorter: (a, b) => `${a.user.first_name} ${a.user.last_name}`.localeCompare(`${b.user.first_name} ${b.user.last_name}`),
            sortDirections: ['ascend' , 'descend'],
        },
        {
            title: <b>Application</b>,
            dataIndex: 'id',
            key: '2',
            render: (id, application) => (
                <React.Fragment>
                    {application.is_winner && <><Tag color="green">Winner</Tag>{' '}</>}
                    {application.is_submitted? <Link to={`/application/${application.id}/view`}>View</Link> : "Cannot view unsubmitted application"}
                </React.Fragment>
            ),
        },
        {
            title: <b>Average Score</b>,
            dataIndex: 'average_user_score',
            key: 'average_user_score',
            sorter: (a, b) => {
                const aScore = a.average_user_score || 0;
                const bScore = b.average_user_score || 0;
                return aScore - bScore;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: <b>All Scores</b>,
            dataIndex: 'user_scores',
            key: '2',
            render: (id, application) => (
                <React.Fragment>
                    {application.user_scores && Object.keys(application.user_scores).length > 0 &&

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
                                        <td>{application.user_scores[scorerId].user_id} </td>
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
            title: <b>Select Winner</b>,
            dataIndex: 'id',
            key: '3',
            render: (applicationID, application) => (
                <React.Fragment>
                    {application.is_submitted? renderWinnerButton(applicationID, scholarship, selectWinner) : "Cannot select unsubmitted application"}
                </React.Fragment>
            ),
        },
    ];

    return (<Table columns={columns} dataSource={applications} rowKey="id" />)
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

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipManage);