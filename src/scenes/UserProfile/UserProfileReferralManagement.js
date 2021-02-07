import React from "react";
import { message, Button } from 'antd';

import {connect} from "react-redux";
import ReferredByInput from "../../components/ReferredByInput";


class UserProfileReferralManagement extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = { 
            copySuccess: '' 
        }
      }
    
      copyToClipboard = (e) => {
        this.textArea.select();
        document.execCommand('copy');
        // This is just personal preference.
        // I prefer to not show the whole text area selected.
        //  https://stackoverflow.com/a/42844911/5405197
        e.target.focus();
        message.success('copied!')
        this.setState({ copySuccess: 'Copied!' });
        setTimeout(() => {
            this.setState({ copySuccess: '' });
        }, 3000);
      };
    
      render() {

        const {  userProfile } = this.props;

        const referralUrl = `https://atila.ca/j/${userProfile.username}`

        return (
          <div>
            Your Referral Code:
              <input
                className="form-control"
                ref={(textarea) => this.textArea = textarea}
                value={referralUrl}
                readOnly={true}
              />
              {
               /* Logical shortcut for only displaying the 
                  button if the copy command exists */
               document.queryCommandSupported('copy') &&
                <div className="my-3">
                  <Button 
                  onClick={this.copyToClipboard}>Copy to Clipboard</Button> 
                  {this.state.copySuccess}
                </div>
              }

            <div className="mb-3">
              <label>
                  Were you referred to Atila by someone?
              </label>
            <ReferredByInput />
            </div>
          </div>
        );
      }


}
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(UserProfileReferralManagement);