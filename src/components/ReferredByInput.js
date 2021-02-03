import React from 'react';
import { connect } from "react-redux";
import { AutoComplete } from 'antd';
import { MinusCircleOutlined } from "@ant-design/icons";
import SearchApi from '../services/SearchAPI';
import { Spin } from 'antd';
const { Option } = AutoComplete;

const UserProfileReferralPreview  = ({userProfile}) => {

    console.log({userProfile});
    
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
            referredBySearchValue: "",
            referralOptions: [],
            referredByUserProfile: null,
            isLoading: false,
        }

    }

  onSearch = (searchText) => {
    console.log("onSearch");
    console.log({searchText});

    if (!searchText || searchText.length < 3) {
        this.setState({referralOptions: [] })
    } else {
        this.searchUserProfiles(searchText);
    }
    
  };

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
    console.log('onSelect', data, selectedUserProfile);
    this.setState({referredByUserProfile: selectedUserProfile.userprofile});
  };

  onChange = (data) => {
      console.log("onChange");
      console.log({data});
      this.setState({referredBySearchValue: data});
  };

  onClear = () => {
      console.log("onClear");
      this.onChange("");
      this.onSearch("");
      this.onSelect(null, {});
  };

  render() {

    const { referralOptions, referredBySearchValue, referredByUserProfile, isLoading } = this.state;
    console.log({ referralOptions, referredBySearchValue });

    let notFoundContent;

    if (!referredBySearchValue || referredBySearchValue.length < 3) {
        notFoundContent = "Please enter at least 3 characters";
    } else if (isLoading) {
        notFoundContent = (
            <p>
                Loading <Spin />
            </p>
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

export default connect(mapStateToProps)(ReferredByInput);
