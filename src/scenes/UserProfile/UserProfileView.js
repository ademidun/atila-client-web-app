import React from 'react';

class UserProfileView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userProfile: null
        }
    }

    render () {
        const { match : { params : { username }} } = this.props;

        return (
            <div className="text-center container mt-3">
                <div className="card shadow">
                    <h1>View Profile for { username }</h1>
                </div>
            </div>
        );
    }
}

export default UserProfileView;
