import React from 'react';
import { Button } from "antd";
import Loading from "../../components/Loading";
import UserProfileAPI from "../../services/UserProfileAPI";
import UserProfileViewTabs from "./UserProfileViewTabs";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import {RESERVED_USERNAMES} from "../../models/Constants";
import FileInput from "../../components/Form/FileInput";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import UserProfileReferralManagement from './UserProfileReferralManagement';

class UserProfileView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userProfile: null,
            errorGettingUserProfile: null,
            showProfilePictureUpload: false,
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

        if(!username || RESERVED_USERNAMES.includes(username)) {
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

    toggleShowProfilePictureUpload = (event) => {
        const { showProfilePictureUpload } = this.state;

        this.setState({showProfilePictureUpload: !showProfilePictureUpload});

    };


    onChangeProfilePicture = (event) => {
        const { loggedInUserProfile, updateLoggedInUserProfile } = this.props;

        UserProfileAPI.patch(
            {
                profile_pic_url: event.target.value,
            }, loggedInUserProfile.user)
            .then(res => {
                updateLoggedInUserProfile(res.data);
            })
            .catch(err=> {
                console.log({err});
            });
    };

    render () {
        const { errorGettingUserProfile, userProfile, showProfilePictureUpload } = this.state;
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
            title: `${userProfile.first_name}'s profile (@${userProfile.username}) `,
            description: `${userProfile.first_name}'s profile @${userProfile.username} on Atila`,
            image: userProfile.profile_pic_url,
            slug: `/profile/${userProfile.username}`
        };

        return (

            <div className="container mt-3">
                <HelmetSeo content={seoContent} />
                <div className="card shadow p-3">
                    <div className="row">
                        <div className="col-md-5 col-sm-12 text-center">
                         <img
                            alt="user profile"
                            style={{ height: '250px', width: 'auto' }}
                            className="rounded-circle cursor-pointer"
                            src={userProfileView.profile_pic_url}
                            onClick={this.toggleShowProfilePictureUpload}
                         />

                            {isProfileEditable &&
                            <div>
                                <Button onClick={this.toggleShowProfilePictureUpload}
                                        type="link">
                                    {showProfilePictureUpload ? 'Hide ': null}Edit Profile Picture
                                </Button>
                                {showProfilePictureUpload &&
                                    <>
                                <FileInput title={"Profile Picture"}
                                           type={"image"}
                                           keyName={"profile_pic_url"}
                                           filePath={`user-profile-pictures/${userProfile.user}`}
                                           onChangeHandler={this.onChangeProfilePicture} />
                                           <p className="text-muted">
                                               Changes are auto-saved
                                           </p>
                                   </>

                                }
                            </div>
                            }
                        </div>
                        <div className="col-md-6 col-sm-12">
                                <h1>{ userProfileView.first_name }{' '}{ userProfileView.last_name }</h1>
                            {userProfileView.public_metadata && userProfileView.public_metadata.profile_link_url &&
                            <a href={userProfileView.public_metadata.profile_link_url}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="btn btn-primary"
                            >
                                {userProfileView.public_metadata.profile_link_name}
                            </a>
                            }
                            {isProfileEditable && 
                            <>
                            <hr/>
                            <UserProfileReferralManagement /> 
                            </>
                            }
                            <hr/>
                        </div>
                    </div>
                </div>

                <UserProfileViewTabs userProfile={userProfile} isProfileEditable={isProfileEditable} />
            </div>
        );
    }
}
const mapDispatchToProps = {
    updateLoggedInUserProfile
};

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserProfileView);
