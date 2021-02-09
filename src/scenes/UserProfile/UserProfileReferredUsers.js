import React from "react";
import {connect} from "react-redux";
import { Spin, Menu, Alert, Button, Dropdown } from 'antd';
import { getErrorMessage, prettifyKeys } from "../../services/utils";
import UserProfileAPI from '../../services/UserProfileAPI';
import { DownOutlined } from '@ant-design/icons';
import { UserProfileReferralPreview } from '../../components/ReferredByInput';


class UserProfileReferredUsers extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = { 
            referredUserProfiles: [],
            atilaPointsDetail: {}, 
            isLoading: null,
            getReferralsError: "",
            showReferredUsers: false,
            showAtilaPointsDetail: false,
        }
      }

      componentDidMount() {
            this.getReferredUsers();
      }
    
      getReferredUsers = () => {
        this.setState({isLoading: "Loading Referrals..."});

        
        const { userProfile } = this.props;

        UserProfileAPI.getUserContent(userProfile.user, 'referrals')
        .then(res => {
            const { referral_user_profiles: referredUserProfiles, atila_points_detail: atilaPointsDetail } = res.data;
            this.setState({ referredUserProfiles, atilaPointsDetail });
        })
        .catch(err => {
            console.log({err});
            this.setState({ getReferralsError: getErrorMessage(err) });
        })
        .finally(() => {
            this.setState({isLoading: false});
        });
      };

      /**
       * TODO toggleShowReferredUsers
       * and toggleShowAtilaPointsDetail should be combined into one function
       */
      toggleShowReferredUsers = () => {
          const { showReferredUsers } = this.state;
          this.setState({showReferredUsers: !showReferredUsers})
      }

      toggleShowAtilaPointsDetail = () => {
          const { showAtilaPointsDetail } = this.state;
          this.setState({showAtilaPointsDetail: !showAtilaPointsDetail})
      }

      render() {

        const {  referredUserProfiles, atilaPointsDetail, isLoading, getReferralsError } = this.state;

        if (isLoading) {
            return (
                <div>
                    {isLoading}
                    <Spin />
                </div>
            )
        }
        

        const referredUsersList = (
                <Menu>
                    {referredUserProfiles.map(userProfile => (
                        <Menu.Item key={userProfile.username}>
                            <UserProfileReferralPreview  userProfile={userProfile} linkProfile={true}/>
                        </Menu.Item>
                    ))}
                </Menu>
        )

        const atilaPointsDetailList = (
            <Menu>
                {Object.keys(atilaPointsDetail)
                        .map(atilaPointDetailKey => (
                        <Menu.Item key={atilaPointDetailKey}>
                            <strong>{prettifyKeys(atilaPointDetailKey)}: </strong>{atilaPointsDetail[atilaPointDetailKey]}
                        </Menu.Item>
                ))}
            </Menu>
        )
        
        return (
            <div>
                <Dropdown overlay={referredUsersList}>
                <Button>
                    Referred Users <DownOutlined />
                </Button>
                </Dropdown>
                <Dropdown overlay={atilaPointsDetailList}>
                <Button>
                    Atila Points Detail <DownOutlined />
                </Button>
                </Dropdown>
                {getReferralsError &&
                    <div className="my-2">
                        Error: <br/>
                        <Alert
                            type="error"
                            message={getReferralsError}
                            style={{maxWidth: '300px'}}
                        />
                    </div>
                }
          </div>
        )

      }
    

}


const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(UserProfileReferredUsers);