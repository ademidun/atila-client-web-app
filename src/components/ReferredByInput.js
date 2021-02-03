import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { AutoComplete } from 'antd';
import { MinusCircleOutlined } from "@ant-design/icons";
import SearchApi from '../services/SearchAPI';
import { Spin } from 'antd';
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
      const { username } = this.props;
      if (username) {
          this.searchUserProfiles(username);
      }
  }

  searchUserProfiles = (searchText) => {
    this.setState({isLoading: true});
    
    SearchApi
    .searchUserProfiles(searchText)
    .then(res => {
        let { user_profiles } = res.data;
        this.setState({referralOptions: user_profiles})

    })
    .catch(err => {
        console.log({err})
    })
    .finally( () => {
        this.setState({isLoading: false});
    })
  }

  onSelect = (data, selectedUserProfile) => {

    const { onSelect } = this.props;
    this.setState({referredByUserProfile: selectedUserProfile.userprofile});

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

    const { referralOptions, referredBySearchValue, referredByUserProfile, isLoading } = this.state;

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
      <>
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
      {referredByUserProfile && 
      <div className="my-2">
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
      </>
    );
  };

  }

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

ReferredByInput.propTypes = {
    username: PropTypes.string,
    onSelect: PropTypes.func,
};

export default connect(mapStateToProps)(ReferredByInput);
