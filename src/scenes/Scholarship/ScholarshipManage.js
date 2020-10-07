import React from 'react';
import {connect} from "react-redux";

class ScholarshipManage extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <h1>Testing</h1>
        )
    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipManage);