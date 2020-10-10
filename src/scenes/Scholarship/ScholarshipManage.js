import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Table} from "antd";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import Loading from "../../components/Loading";

class ScholarshipManage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            applications: null,
            isLoading: false,
        }
    }

    componentDidMount() {
        this.getScholarshipApplications()
    }

    getScholarshipApplications = () => {
        const { match : { params : { scholarshipID }} } = this.props;

        this.setState({isLoading: true});
        ScholarshipsAPI.getApplications(scholarshipID)
            .then(res => {
                const applications =  res.data.applications;
                this.setState({applications});
                console.log("created: ", applications)
            })
            .finally(() => {
                this.setState({isLoading: false});
            });
    };

    render() {
        const {  applications, isLoading } = this.state;

        if (isLoading) {
            return (<Loading title={`Loading Applications`} className='mt-3' />)
        }

        return (
            <div className="container mt-5">
                <ApplicationsTable applications={applications} />
            </div>
        )
    }
}

function ApplicationsTable({ applications }){

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: '1',
            render: (id) => (<p>{id}</p>),
        },
        {
            title: 'View Application',
            dataIndex: 'id',
            key: '2',
            render: (id, application) => (
                <Link to={`/application/${application.id}`}>View Application<br/>({id})</Link>
            ),
        },
        {
            title: '',
            dataIndex: 'id',
            key: '3',
            render: (id) => (
                <button type={"button"} className={"btn btn-success"} onClick={() => selectWinner(id)}>
                        Select Winner
                </button>
            ),
        },
    ];

    return (<Table columns={columns} dataSource={applications} rowKey="id" />)
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