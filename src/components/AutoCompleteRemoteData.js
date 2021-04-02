import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {updateLoggedInUserProfile} from "../redux/actions/user";
import { AutoComplete, Alert } from 'antd';
import SearchApi from '../services/SearchAPI';
import { Spin } from 'antd';
import { getErrorMessage } from '../services/utils';
import { UserProfilePreview } from './ReferredByInput';
const { Option } = AutoComplete;

/**
 * This component is used to load some arbitrary data type
 * from a network server such as the backend API using Autocomplete.
 */
class AutoCompleteRemoteData extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            searchText: props.searchText || "",
            referralOptions: [],
            selectedObject: props.selectedObject || null,
            isLoading: false,
            referralError: null
        }

    }

  onSearch = (searchText) => {

    if (!searchText || searchText.length < 3) {
        this.setState({referralOptions: [] })
    } else {
        this.searchRemoteData(searchText);
    }
    
  };

  componentDidMount() {
      const { username, loggedInUserProfile } = this.props;

      if (loggedInUserProfile && loggedInUserProfile.referred_by_detail) {
        this.setState({selectedObject: loggedInUserProfile.referred_by_detail});
      } else if (username) {
          this.searchRemoteData(username);
      }
  }

  searchRemoteData = (searchText) => {
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

  onSelect = (data, selectedObject) => {

    console.log({data, selectedObject});

    const { onSelect, type } = this.props;

    if (type === "user") {
        selectedObject = selectedObject.userprofile;
    }


    if (onSelect && selectedObject) {
        onSelect(selectedObject);
    }
    

    
  };

  onChange = (data) => {
      this.setState({searchText: data});
  };

  onClear = () => {
      this.onChange("");
      this.onSearch("");
      this.onSelect(null, {});
  };

  render() {

    const { referralOptions, searchText, isLoading, referralError } = this.state;

    const { disabled, type } = this.props;

    let notFoundContent;

    if (!searchText || searchText.length < 3) {
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
                <AutoComplete
                style={{
                    width: "100%",
                }}
                disabled={disabled}
                value={searchText}
                defaultOpen={this.props.searchText}
                onSelect={this.onSelect}
                notFoundContent={notFoundContent}
                onSearch={this.onSearch}
                onChange={this.onChange}
                placeholder={this.props.placeholder}
                >
                    {type === "user" && referralOptions.map((userProfile) => (
                        <Option key={userProfile.username || userProfile } 
                                value={userProfile.username || userProfile}
                                // custom userprofile prop must be all lowercase
                                userprofile={userProfile}>
                            <UserProfilePreview userProfile={userProfile} />
                        </Option>
                    ))}
            </AutoComplete>
        </div>
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


AutoCompleteRemoteData.propTypes = {
    searchText: PropTypes.string,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    loggedInUserProfile: PropTypes.shape({}),
    selectedObject: PropTypes.shape({}),
    type: PropTypes.oneOf(['user', 'scholarship']).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteRemoteData);
