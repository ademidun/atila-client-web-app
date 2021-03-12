import React from "react";
import PropTypes from 'prop-types';
import UserProfileAPI from "../../services/UserProfileAPI";
import Loading from "../../components/Loading";
import {connect} from "react-redux";
import {updateLoggedInUserProfile} from "../../redux/actions/user";
import { Button, Input } from "antd";
import UserProfileReferralManagement from './UserProfileReferralManagement';
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
const { TextArea } = Input;
class UserProfileAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userProfile: {},
            isLoading: null,
            errorMessage: null,
            referralUserProfiles: null,
            atilaPointsDetail: null,
            enrollmentProofFailedReason: "",
        }
    }

    componentDidMount() {

        this.loadUserProfile();
        
    }

    loadUserProfile() {

        const { username } = this.props;
        this.setState({isLoading: "Loading user profile"});
        UserProfileAPI.getUsernameAdminView(username)
            .then(res => {
                const { user_profile, referral_user_profiles, atila_points_detail } = res.data;
                const { enrollment_proof_failed_reason: enrollmentProofFailedReason} = user_profile;

                this.setState({userProfile: user_profile, referralUserProfiles: referral_user_profiles,
                     atilaPointsDetail: atila_points_detail, enrollmentProofFailedReason});

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

    updateFailReason = event => {
        this.setState({enrollmentProofFailedReason: event.target.value,});
    };



    verifyUserProfile = (enrollment_proof_verified) => {
        
        const { enrollmentProofFailedReason, userProfile } = this.state;
        const verificationData = {
            enrollment_proof_verified,
            // clear the enrollment_proof_failed_reason if the proof was succesfully verified
            enrollment_proof_failed_reason: enrollment_proof_verified ? "" : enrollmentProofFailedReason,
        }
        this.setState({isLoading: "Saving enrollment verification message"});

        UserProfileAPI.verifyUserProfile(userProfile.user, verificationData)
        .then(res => {
            const { user_profile } = res.data;
            const { enrollment_proof_failed_reason: enrollmentProofFailedReason} = user_profile;
            this.setState({ userProfile: user_profile, enrollmentProofFailedReason });

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
    };


    render() {
        const { username } = this.props;
        const { isLoading, errorMessage, userProfile, referralUserProfiles,
             atilaPointsDetail, enrollmentProofFailedReason } = this.state;
             
        const checkIcon = (<CheckCircleTwoTone twoToneColor="#52c41a" />);

        const closeIcon = (<CloseCircleTwoTone twoToneColor="#FF0000" />);

        let verifiedDate;

        if (userProfile.enrollment_proof_verified_date) {
            verifiedDate = new Date(userProfile.enrollment_proof_verified_date);
            verifiedDate =  (<p className="text-muted center-block">
                Date Verified: {verifiedDate.toDateString()}{' '}
                {verifiedDate.toLocaleTimeString()}
            </p>)
        }
        return (<React.Fragment>
            <h1>Admin Information for {userProfile.first_name}  {userProfile.last_name}</h1>

            {isLoading && <Loading title={isLoading} className='mt-3' />}
            <div>
                Verification Steps:
                <ol>
                    <li>
                        {userProfile.profile_pic_verified ? checkIcon : closeIcon}{' '}
                         Upload profile picture
                    </li>

                    <li>
                        {userProfile.security_question_is_answered ? checkIcon : closeIcon}{' '}
                        Answer Security Question
                    </li>
                    <li>
                        {userProfile.enrollment_proof_verified ? checkIcon : closeIcon}{' '}
                         Verified proof of enrollment
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

            <div>
            <TextArea name="enrollment-proof-failed-reason" value={enrollmentProofFailedReason} 
                                            onChange={this.updateFailReason} rows={6} placeholder={"If this enrollment proof is invalid, explain why..."}/>
            </div>


            <div className="my-2">
                {verifiedDate && 
                
                <>
                {verifiedDate}
                </>
                }
                <Button type="primary" disabled={!userProfile.enrollment_proof || isLoading} 
                onClick={(e) => this.verifyUserProfile(true)}>
                    {userProfile.enrollment_proof ? "Mark Enrollment Proof as Valid" : "No Enrollment Proof uploaded"}
                </Button>
                <Button type="danger" disabled={!userProfile.enrollment_proof || isLoading} onClick={(e) => this.verifyUserProfile(false)} className="ml-2">
                    {userProfile.enrollment_proof ? "Mark Enrollment Proof as Failed" : "No Enrollment Proof uploaded"}
                </Button>
            </div>

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