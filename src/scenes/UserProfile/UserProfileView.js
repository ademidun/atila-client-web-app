import React from 'react';
import Loading from "../../components/Loading";
import UserProfileAPI from "../../services/UserProfileAPI";
import UserProfileViewTabs from "./UserProfileViewTabs";

class UserProfileView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userProfile: null,
            errorGettingUserProfile: null,
        }
    }

    componentDidMount() {
        this.loadContent();
    }
    componentDidUpdate(prevProps, prevState) {
        const { userProfile, errorGettingUserProfile } = this.state;
        if (userProfile === null && !errorGettingUserProfile) {
            this.loadContent();
        }
    }

    loadContent = () => {
        const { match : { params : { username }} } = this.props;
        UserProfileAPI.getUsername(username)
            .then(res => {
                this.setState({userProfile: res.data});

            })
            .catch(err => {
                this.setState({errorGettingUserProfile: { err }});
            })
    };

    render () {
        const { errorGettingUserProfile, userProfile } = this.state;

        if (errorGettingUserProfile) {
            return (
                <div className="text-center">
                    <h1>Error Getting User Profile.</h1>
                    <h3>
                        Please try again later
                    </h3>
                </div>);
        }

        if (!userProfile) {
            return (
                <Loading
                    title={'Loading User Profile..'} />)
        }

        return (
            <div className="text-center container mt-3">

                <div className="card shadow p-3">
                    <div className="row">
                        <div className="col-md-4 col-sm-12">
                         <img
                            alt="user profile"
                            style={{ height: '250px', width: 'auto' }}
                            className="rounded-circle"
                            src={userProfile.profile_pic_url} />
                        </div>
                        <div className="col-md-8 col-sm-12">
                                <h1>{ userProfile.first_name } { userProfile.last_name }</h1>
                                <h3 className="text-muted">{ userProfile.title}
                                    { userProfile.post_secondary_school && <br/> }
                                    { userProfile.post_secondary_school}
                                </h3>
                            {userProfile.public_metadata && userProfile.public_metadata.profile_link_url &&
                            <a href={userProfile.public_metadata.profile_link_url}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="btn btn-primary"
                            >
                                {userProfile.public_metadata.profile_link_name}
                            </a>
                            }
                        </div>
                    </div>
                </div>

                <UserProfileViewTabs userProfile={userProfile} />
            </div>
        );
    }
}

export default UserProfileView;
