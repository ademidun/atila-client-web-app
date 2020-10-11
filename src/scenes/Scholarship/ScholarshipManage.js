import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Table} from "antd";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
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
            <ApplicationsTable applications={applications} />
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
            render: (text, application) => (
                <Link to={`/application/${application.id}`}>View Application<br/>({text})</Link>
            ),
        },
    ];

    return (<Table columns={columns} dataSource={applications} rowKey="id" />)
}


const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipManage);