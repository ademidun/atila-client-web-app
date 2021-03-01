import React from "react";
import {connect} from "react-redux";
import { Spin, Menu, Alert, Button, Dropdown } from 'antd';
import { getErrorMessage, prettifyKeys } from "../../services/utils";
import UserProfileAPI from '../../services/UserProfileAPI';
import { DownOutlined } from '@ant-design/icons';
import { UserProfilePreview } from '../../components/ReferredByInput';


class UserProfileReferredUsers extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = { 
            referredUserProfiles: [],
            atilaPointsDetail: {}, 
            isLoading: null,
            requestError: "",
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
            this.setState({ requestError: getErrorMessage(err) });
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

        const {  referredUserProfiles, atilaPointsDetail, isLoading, requestError } = this.state;

        if (isLoading) {
            return (
                <div>
                    {isLoading}
                    <Spin />
                </div>
            )
        }
        

        let referredUsersList = (
                <Menu>
                    {referredUserProfiles.map(userProfile => (
                        <Menu.Item key={userProfile.username}>
                            <UserProfilePreview userProfile={userProfile} />
                        </Menu.Item>
                    ))}
                </Menu>
        )

        if (referredUserProfiles.length === 0) {
            referredUsersList = (
                <Menu>
                    <Menu.Item>
                        No referred users
                    </Menu.Item>
                </Menu>
            )
        }

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
                {!requestError && 
                <>
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
                </>
                }
                {requestError &&
                    <div className="my-2">
                        Error: <br/>
                        <Alert
                            type="error"
                            message={requestError}
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