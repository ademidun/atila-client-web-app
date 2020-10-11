import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Table, Popconfirm} from "antd";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";

class ScholarshipManage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scholarship: null,
            applications: null,
            unsubmittedApplications: null,
            isLoadingApplications: true,
            isLoadingScholarship: true
        }
    }

    componentDidMount() {
        this.getScholarshipApplications()
        this.getScholarship()
    }

    getScholarship = () => {
        const { match : { params : { scholarshipID }} } = this.props;

        this.setState({isLoadingScholarship: true});
        ScholarshipsAPI.get(scholarshipID)
            .then(res => {
                const scholarship =  res.data;
                this.setState({scholarship});
            })
            .finally(() => {
                this.setState({isLoadingScholarship: false});
            });
    }

    getScholarshipApplications = () => {
        const { match : { params : { scholarshipID }} } = this.props;

        this.setState({isLoadingApplication: true});
        ScholarshipsAPI.getApplications(scholarshipID)
            .then(res => {
                const applications =  res.data.applications;
                const unsubmittedApplications =  res.data.unsubmitted_applications;
                this.setState({applications, unsubmittedApplications});
            })
            .finally(() => {
                this.setState({isLoadingApplication: false});
            });
    };

    render() {
        const { scholarship, applications, isLoadingApplication,
            isLoadingScholarship, unsubmittedApplications } = this.state;

        if (isLoadingApplication || isLoadingScholarship) {
            return (<Loading title={`Loading Applications`} className='mt-3' />)
        } else if (!scholarship || !applications) {
            return (
                <h1>
                  Scholarship Not Found
                </h1>
            )
        }


        const allApplications = [...applications, ...unsubmittedApplications];

        return (
            <div className="container mt-5">
                <h2>
                    Submitted applications: {applications.length} <br/>
                    Un-submitted Applications (under draft): {unsubmittedApplications.length}
                </h2>
                <br />
                <ApplicationsTable applications={allApplications} scholarship={scholarship}/>
            </div>
        )
    }
}

function ApplicationsTable({ applications, scholarship }){

    const columns = [
        {
            title: <b>Full Name</b>,
            dataIndex: 'user',
            key: '1',
            render: (userProfile) => (userProfile && userProfile.first_name && `${userProfile.first_name} ${userProfile.last_name}`),
        },
        {
            title: <b>Application</b>,
            dataIndex: 'id',
            key: '2',
            render: (id, application) => (
                <React.Fragment>
                    {application.is_submitted? <Link to={`/application/${application.id}`}>View</Link> : "Cannot view unsubmitted application"}
                </React.Fragment>
            ),
        },
        {
            title: <b>Select Winner</b>,
            dataIndex: 'id',
            key: '3',
            render: (applicationID, application) => (
                <React.Fragment>
                    {application.is_submitted? renderWinnerButton(applicationID, scholarship) : "Cannot select unsubmitted application"}
                </React.Fragment>
            ),
        },
    ];

    return (<Table columns={columns} dataSource={applications} rowKey="id" />)
}

const renderWinnerButton = (applicationID, scholarship) => {
    const confirmText = "Are you sure you want to pick this winner? You will not be able to undo this action."

    return (
        <Popconfirm placement="topLeft" title={confirmText} onConfirm={() => selectWinner(applicationID, scholarship)} okText="Yes" cancelText="No">
            <button type={"button"} className={"btn btn-success"}>
                Select Winner
            </button>
        </Popconfirm>
    )
}


const selectWinner = (applicationID, scholarship) => {

    const winners = {winners: [applicationID]}

    const scholarshipID = scholarship.id

    //Set application.is_winner to true
    ScholarshipsAPI
        .selectWinners(scholarshipID, winners)
        .then(res=>{
        })
        .catch(err => {
            console.log({err});
        })
};


const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipManage);