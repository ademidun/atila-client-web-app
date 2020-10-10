import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import ScholarshipDeadlineWithTags from "../../components/ScholarshipDeadlineWithTags";
import {Table} from "antd";
import UserProfileAPI from "../../services/UserProfileAPI";

class ScholarshipManage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            applicants: null,
            isLoading: false,
        }
    }

    /*componentDidMount() {
        const { userProfile: {user : userId} } = this.props;
        this.setState({isLoading: true});
        UserProfileAPI.getUserContent(userId, 'scholarship_applicants')
            .then(res => {
                const applicants =  res.data.created_scholarships;
                this.setState({applicants});
                console.log("created: ", applicants)
            })
            .finally(() => {
                this.setState({isLoading: false});
            });
    }
    */

    render() {
        return (
            <h1>Testing</h1>
        )
    }
}

function ApplicantsTable({ applicants }){

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: '1',
            render: (name) => (<p>{name}</p>),
        },
        {
            title: 'View Application',
            dataIndex: 'id',
            key: '2',
            render: (text, application) => (
                <Link to={`/application/${application.id}`}>View Application <br/>({text})</Link>
            ),
        },
    ];

    return (<Table columns={columns} dataSource={applicants} rowKey="id" />)
}


const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipManage);