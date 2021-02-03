import React from 'react';
import { connect } from "react-redux";
import { AutoComplete } from 'antd';
import { MinusCircleOutlined } from "@ant-design/icons";

const { Option } = AutoComplete;

const mockVal = (str, repeat = 1) => {
  return {
    profile_pic_url: "https://i.imgur.com/Ezc5Hyf.jpg",
    first_name: str.repeat(repeat),
    last_name: str.repeat(repeat),
    username: `username__${str.repeat(repeat)}`,
};
};

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
        }

    }

  onSearch = (searchText) => {
    console.log("onSearch");
    console.log({searchText});

    let referralOptions = [];

    if (!searchText || searchText.length < 3) {
        referralOptions = [];
        this.setState({referralOptions})
    } else {
        referralOptions = [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];
        this.setState({referralOptions})
    }
    
  };

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

    const { referralOptions, referredBySearchValue, referredByUserProfile } = this.state;
    console.log({ referralOptions, referredBySearchValue });

    return (
      <>
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
        <AutoComplete
          style={{
            width: "100%",
          }}
          disabled={!!referredByUserProfile}
          value={referredBySearchValue}
          onSelect={this.onSelect}
          notFoundContent={!referredBySearchValue || referredBySearchValue.length < 3 ? "Please enter at least 3 characters": "No user found"}
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
      </>
    );
  };

  }

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ReferredByInput);
