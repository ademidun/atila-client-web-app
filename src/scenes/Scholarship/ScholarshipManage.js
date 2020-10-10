import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Table, Popconfirm} from "antd";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import Loading from "../../components/Loading";
import render from "enzyme/src/render";

class ScholarshipManage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scholarship: null,
            applications: null,
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
                console.log("created: ", scholarship)
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
                this.setState({applications});
                console.log("created: ", applications)
            })
            .finally(() => {
                this.setState({isLoadingApplication: false});
            });
    };

    render() {
        const { scholarship, applications, isLoadingApplication, isLoadingScholarship } = this.state;

        if (isLoadingApplication || isLoadingScholarship) {
            return (<Loading title={`Loading Applications`} className='mt-3' />)
        }

        return (
            <div className="container mt-5">
                <h2>You have {scholarship.number_available_scholarships} available scholarships.</h2>
                <br />
                <ApplicationsTable applications={applications} />
            </div>
        )
    }
}

function ApplicationsTable({ applications }){

    const columns = [
        {
            title: <b>Full Name</b>,
            dataIndex: 'user_profile_responses',
            key: '1',
            render: (userReponses) => (<p>{userReponses[0].value} {userReponses[1].value}</p>),
        },
        {
            title: <b>Application</b>,
            dataIndex: 'id',
            key: '2',
            render: (id, application) => (
                <Link to={`/application/${application.id}`}>View</Link>
            ),
        },
        {
            title: '',
            dataIndex: 'id',
            key: '3',
            render: (id) => (
                renderWinnerButton(id)
            ),
        },
    ];

    return (<Table columns={columns} dataSource={applications} rowKey="id" />)
}

const renderWinnerButton = id => {
    const confirmText = "Are you sure you want to pick this winner? You will not be able to undo this action."

    return (
        <Popconfirm placement="topLeft" title={confirmText} onConfirm={() => selectWinner(id)} okText="Yes" cancelText="No">
            <button type={"button"} className={"btn btn-success"}>
                Select Winner
            </button>
        </Popconfirm>
    )
}


const selectWinner = id => {
    console.log(id)
    console.log("Winner Selected")

    const winners = {winners: [id]}

    // Set application.is_winner to true
    /*ApplicationsAPI
        .selectWinners(winners)
        .then(res=>{

        })
        .catch(err => {
            console.log({err});
        })
     */
};


const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipManage);