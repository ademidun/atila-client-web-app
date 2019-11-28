import React from 'react';
import Loading from "../../components/Loading";
import UserProfileAPI from "../../services/UserProfileAPI";
import UserProfileViewTabs from "./UserProfileViewTabs";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";

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
        const { match : { params : { username }},
                loggedInUserProfile,
                location: { pathname, search } } = this.props;

        if(!username) {
            if (loggedInUserProfile){
                this.setState({userProfile: loggedInUserProfile});
            } else {

                const errorGettingUserProfile = ((
                    <div className="text-center">
                        <h1>
                            <Link to={`/login?redirect=${pathname}${search}`}>
                            Log in</Link> to view your profile.
                        </h1>
                        <h3>
                            or enter a valid username
                        </h3>
                    </div>));
                this.setState({errorGettingUserProfile });
            }
            return
        }
        UserProfileAPI.getUsername(username)
            .then(res => {
                this.setState({userProfile: res.data});

            })
            .catch(() => {
                const errorGettingUserProfile = ((
                    <div className="text-center">
                        <h1>Error Getting User Profile.</h1>
                        <h3>
                            Please try again later
                        </h3>
                    </div>));
                this.setState({errorGettingUserProfile });
            })
    };

    render () {
        const { errorGettingUserProfile, userProfile } = this.state;
        const { loggedInUserProfile } = this.props;
        if (errorGettingUserProfile) {
            const seoContent = {
                title: `User Profile`,
                description: `User Profile ${defaultSeoContent.description}`,
                image: defaultSeoContent.image,
                slug: `/profile/`
            };
            return <React.Fragment>
                <HelmetSeo content={seoContent} />
                {errorGettingUserProfile}
            </React.Fragment>;
        }

        if (!userProfile) {
            return (
                <Loading
                    title={'Loading User Profile..'} />)
        }

        let userProfileView = loggedInUserProfile && userProfile.user === loggedInUserProfile.user ?
            loggedInUserProfile : userProfile;

        const isProfileEditable = loggedInUserProfile && (userProfile.user === loggedInUserProfile.user
            || userProfile.is_atila_admin);

        const seoContent = {
            title: `${userProfile.first_name}'s profile @${userProfile.username} on Atila`,
            description: `${userProfile.first_name}'s profile @${userProfile.username} on Atila`,
            image: userProfile.profile_pic_url,
            slug: `/profile/${userProfile.username}`
        };

        return (

            <div className="text-center container mt-3">
                <HelmetSeo content={seoContent} />
                <div className="card shadow p-3">
                    <div className="row">
                        <div className="col-md-4 col-sm-12">
                         <img
                            alt="user profile"
                            style={{ height: '250px', width: 'auto' }}
                            className="rounded-circle"
                            src={userProfileView.profile_pic_url} />
                        </div>
                        <div className="col-md-8 col-sm-12">
                                <h1>{ userProfileView.first_name }</h1>
                            {userProfileView.public_metadata && userProfileView.public_metadata.profile_link_url &&
                            <a href={userProfileView.public_metadata.profile_link_url}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="btn btn-primary"
                            >
                                {userProfileView.public_metadata.profile_link_name}
                            </a>
                            }
                        </div>
                    </div>
                </div>

                <UserProfileViewTabs userProfile={userProfile} isProfileEditable={isProfileEditable} />
            </div>
        );
    }
}
const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(UserProfileView);
