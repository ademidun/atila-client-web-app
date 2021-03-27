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
import { Link } from 'react-router-dom';
const { Option } = AutoComplete;

export const UserProfilePreview  = ({userProfile, linkProfile=false}) => {
    
    let nameDisplay= `${userProfile.first_name} ${userProfile.last_name} (${userProfile.username})`;

    if(linkProfile) {
        nameDisplay = (
            <Link to={`/profile/${userProfile.username}`}>
                {nameDisplay}
            </Link>
        )
    }
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
            referredByUserProfile: props.referredByUserProfile || null,
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

    const { loggedInUserProfile } = this.props;

    /**
     * If a user has already submitted an application or created a scholarship.
     * They should not be able to change their referred by field anymore.
     * Otherwise, users may decide to change their fields after the fact to get a referral bonus.
     * See: https://github.com/ademidun/atila-django/pull/276
     * Cast userProfileAlreadyActive to a boolean using '!!' so it doesn't get a value of zero
     */
    
    let userProfileAlreadyActive = false;

    if (loggedInUserProfile) {
        userProfileAlreadyActive = !!((loggedInUserProfile.submitted_applications_count && loggedInUserProfile.submitted_applications_count > 0)
            || (loggedInUserProfile.created_scholarships_count && loggedInUserProfile.created_scholarships_count > 0));
    }

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
                disabled={!!referredByUserProfile||userProfileAlreadyActive}
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
                            <UserProfilePreview userProfile={userProfile} />
                        </Option>
                    ))}
            </AutoComplete>
        </div>
      {userProfileAlreadyActive && 
      <div className="text-muted">
          {loggedInUserProfile.submitted_applications_count > 0 && <p>Referral cannot be changed after an application has been submitted.</p>}
          {loggedInUserProfile.created_scholarships_count > 0 && <p>Referral cannot be changed after a scholarship has been created.</p>}
      </div>
      }
      {referredByUserProfile && 
      <div className="my-2">
        Referred by: <br/>
        <UserProfilePreview userProfile={referredByUserProfile} />

        {!userProfileAlreadyActive && 
        <MinusCircleOutlined
            style={{
                fontSize: "30px",
            }}
            disabled={userProfileAlreadyActive}
            onClick={()=>{
                this.onClear();
            }}
        />}
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
    referredByUserProfile: PropTypes.shape({}),
};

export default connect(mapStateToProps, mapDispatchToProps)(ReferredByInput);
