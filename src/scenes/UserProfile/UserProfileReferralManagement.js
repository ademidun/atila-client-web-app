import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import { message, Button, Popover } from 'antd';

import ReferredByInput from "../../components/ReferredByInput";
import { QuestionCircleOutlined } from "@ant-design/icons";

const atilaPointsPopoverContent = (
    <div>
        Get points for referring people to Atila to apply and start scholarships:
        <ul>
            <li>
                100 points for referring someone to Atila
            </li>
            <li>
                If the person you refer wins a scholarship you get $50
            </li>
            <li>
                1000 points if someone you refer starts a scholarship
            </li>
            <li>
                If they become a finalist you get 500 points
            </li>
            <li>
                People with the top 5 points every couple of months gets cash prizes and gifts.
            </li>
        </ul>
        <Link to="/points">Learn More</Link>
    </div>
);

export const AtilaPointsPopover = ({children, title="What are Atila Points?"}) => (
    <Popover overlayStyle={{maxWidth: "500px"}} content={atilaPointsPopoverContent} title={title}>
        {children}
    </Popover>

);

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

        const referralUrl = `https://atila.ca/j/${userProfile.username}`;

        const atilaPointsChildren = (<div>
                            <p className="font-weight-bold btn-link">
                                {parseInt( userProfile.atila_points ).toLocaleString()}
                                <br />
                                <span style={{fontSize: "smaller"}}>
                                    What are Atila points?
                                    <QuestionCircleOutlined />
                                </span>
                            </p>
        </div>)

        return (
          <div>
              <div className="my-2">
                  Atila Points: <br/>
                  <AtilaPointsPopover children={atilaPointsChildren} />
              </div>
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
              </div>

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