import React from "react";
import PropTypes from 'prop-types';
import UserProfileAPI from "../../services/UserProfileAPI";
import Loading from "../../components/Loading";
import {connect} from "react-redux";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import { Button } from "antd";
import UserProfileReferralManagement from './UserProfileReferralManagement';
import { CheckCircleTwoTone } from "@ant-design/icons";

class UserProfileAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userProfile: null,
            isLoading: null,
            errorMessage: null,
            referralUserProfiles: null,
            atilaPointsDetail: null,
        }
    }

    componentDidMount() {

        this.loadUserProfile();
        
    }

    loadUserProfile() {

        const { username } = this.props;
        this.setState({isLoading: true});
        UserProfileAPI.getUsernameAdminView(username)
            .then(res => {
                const { user_profile, referral_user_profiles, atila_points_detail } = res.data;
                this.setState({userProfile: user_profile, referralUserProfiles: referral_user_profiles, atilaPointsDetail: atila_points_detail});

            })
            .catch(() => {
                const errorMessage = ((
                    <div className="text-center">
                        <h1>Error Getting User Profile.</h1>
                        <h3>
                            Please try again later
                        </h3>
                    </div>));
                this.setState({errorMessage });
            })
            .finally(() => {

                this.setState({isLoading: false});
            })
    }

    render() {
        const { username } = this.props;
        const { isLoading, errorMessage, userProfile, referralUserProfiles, atilaPointsDetail } = this.state;

        if (isLoading) {
            return (<Loading title={`Loading Admin for user`} className='mt-3' />)
        }

        if (!userProfile) {
            return (
                <div>
                    Loading Admin information for user
                </div>
                )
        }
        return (<React.Fragment>
            <h1>Admin Information for {userProfile.first_name}  {userProfile.last_name}</h1>
            <div>
                Verification Steps:
                <ol>
                    <li>
                        
                        <CheckCircleTwoTone twoToneColor="#52c41a" /> Upload profile picture
                    </li>

                    <li>
                        
                        <CheckCircleTwoTone twoToneColor="#52c41a" /> Answer Security Question
                    </li>
                    <li>
                        
                        <CheckCircleTwoTone twoToneColor="#52c41a" /> Upload proof of enrollment
                    </li>
                </ol>
            </div>
            <div>
                {userProfile.enrollment_proof &&
                    <div className="my-2">
                        <a href={userProfile.enrollment_proof} target="_blank"  rel="noopener noreferrer">
                            View Proof of Enrollment
                        </a>
                    </div>
                } 
            </div>

            <Button type="primary" disabled={!userProfile.enrollment_proof}>
                {userProfile.enrollment_proof ? "Mark Enrollment Proof as Valid" : "No Enrollment Proof uploaded"}
            </Button>

            {errorMessage && 
                <>
                    {errorMessage}
                </>
            }
            <div>
                <h3 className="text-center">Atila Points Breakdown for {username}</h3>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(referralUserProfiles, null, 4)}
                </pre>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(atilaPointsDetail, null, 4)}
                </pre>
                <div style={{display: "none"}}>
                    <UserProfileReferralManagement />
                </div>
            </div>
        </React.Fragment>)
    }


}

UserProfileAdmin.propTypes = {
    loggedInUserProfile: PropTypes.shape({}).isRequired,
    username: PropTypes.string.isRequired
};

const mapDispatchToProps = {
    updateLoggedInUserProfile
};

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileAdmin);