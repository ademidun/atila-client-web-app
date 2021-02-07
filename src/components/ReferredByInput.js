import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {updateLoggedInUserProfile} from "../redux/actions/user";
import { AutoComplete, Alert } from 'antd';
import { MinusCircleOutlined } from "@ant-design/icons";
import SearchApi from '../services/SearchAPI';
import { Spin } from 'antd';
import UserProfileAPI from '../services/UserProfileAPI';
import { getErrorMessage } from '../services/utils';
const { Option } = AutoComplete;

const UserProfileReferralPreview  = ({userProfile}) => {
    
    let nameDisplay= `${userProfile.first_name} ${userProfile.last_name} (${userProfile.username})`;
    return (
        <div style={{display: "inline"}} className="mr-1">
        <img src={userProfile.profile_pic_url}
                className="rounded-circle m-1"
                alt={nameDisplay} 
                style={{width: "30px"}} />
            {nameDisplay}
        </div>
    )
}

class ReferredByInput extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            referredBySearchValue: props.username || "",
            referralOptions: [],
            referredByUserProfile: null,
            isLoading: false,
            referralError: null
        }

    }

  onSearch = (searchText) => {

    if (!searchText || searchText.length < 3) {
        this.setState({referralOptions: [] })
    } else {
        this.searchUserProfiles(searchText);
    }
    
  };

  componentDidMount() {
      const { username, loggedInUserProfile } = this.props;

      if (loggedInUserProfile && loggedInUserProfile.referred_by_detail) {
        this.setState({referredByUserProfile: loggedInUserProfile.referred_by_detail});
      } else if (username) {
          this.searchUserProfiles(username);
      }
  }

  searchUserProfiles = (searchText) => {
    this.setState({isLoading: true, referralError: null});
    
    SearchApi
    .searchUserProfiles(searchText)
    .then(res => {
        let { user_profiles } = res.data;
        this.setState({referralOptions: user_profiles})

    })
    .catch(err => {
        this.setState({referralError: getErrorMessage(err)});
    })
    .finally( () => {
        this.setState({isLoading: false});
    })
  }

  onSelect = (data, selectedUserProfile) => {

    const { onSelect, loggedInUserProfile } = this.props;

    if (loggedInUserProfile && selectedUserProfile.userprofile) {

        this.setState({isLoading: true, referralError: null});
        UserProfileAPI
        .patch({referred_by: selectedUserProfile.userprofile.username}, loggedInUserProfile.user)
        .then(res => {
            const { data: userProfile } = res;
            updateLoggedInUserProfile(userProfile);
            this.setState({referredByUserProfile: selectedUserProfile.userprofile});
        })
        .catch(err => {
            this.setState({referralError: getErrorMessage(err)});
        })
        .finally( () => {
            this.setState({isLoading: false});
        })
    } else {
        this.setState({referredByUserProfile: selectedUserProfile.userprofile});
    }
    

    if (onSelect && selectedUserProfile.userprofile) {
        onSelect(selectedUserProfile.userprofile);
    }
  };

  onChange = (data) => {
      this.setState({referredBySearchValue: data});
  };

  onClear = () => {
      this.onChange("");
      this.onSearch("");
      this.onSelect(null, {});
  };

  render() {

    const { referralOptions, referredBySearchValue, referredByUserProfile,
         isLoading, referralError } = this.state;

    let notFoundContent;

    if (!referredBySearchValue || referredBySearchValue.length < 3) {
        notFoundContent = "Please enter at least 3 characters";
    } else if (isLoading) {
        notFoundContent = (
            <div>
                Loading <Spin />
            </div>
        )
    } else {
        notFoundContent = "No user found"
    }

    return (
      <div>
        <div>
            <label>If they have an Atila account, you can enter their name or username here.</label> <br />
                <AutoComplete
                style={{
                    width: "100%",
                }}
                disabled={!!referredByUserProfile}
                value={referredBySearchValue}
                defaultOpen={this.props.username}
                onSelect={this.onSelect}
                notFoundContent={notFoundContent}
                onSearch={this.onSearch}
                onChange={this.onChange}
                placeholder="Enter name or username of person who referred you"
                >
                    {referralOptions.map((userProfile) => (
                        <Option key={userProfile.username || userProfile } 
                                value={userProfile.username || userProfile}
                                // custom userprofile prop must be all lowercase
                                userprofile={userProfile}>
                            <UserProfileReferralPreview userProfile={userProfile} />
                        </Option>
                    ))}
            </AutoComplete>
        </div>
      {referredByUserProfile && 
      <div className="my-2">
        Referred by: <br/>
        <UserProfileReferralPreview userProfile={referredByUserProfile} />
        <MinusCircleOutlined
            style={{
                fontSize: "30px",
            }} 
            onClick={()=>{
                this.onClear();
            }}
        />
      </div>
      }
      {referralError &&
      <div className="my-2">
        Error: <br/>
        <Alert
            type="error"
            message={referralError}
            style={{maxWidth: '300px'}}
        />
        </div>
        }
      </div>
    );
  };

  }

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};

const mapDispatchToProps = {
    updateLoggedInUserProfile
};

ReferredByInput.propTypes = {
    username: PropTypes.string,
    onSelect: PropTypes.func,
    loggedInUserProfile: PropTypes.shape({}),
};

export default connect(mapStateToProps, mapDispatchToProps)(ReferredByInput);
