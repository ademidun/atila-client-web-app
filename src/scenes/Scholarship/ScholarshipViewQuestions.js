import React from 'react'
import {connect} from "react-redux";

class ScholarshipViewQuestions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render () {
        return (
            <div className="container mt-5">
                <h1>Testing</h1>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ScholarshipViewQuestions);