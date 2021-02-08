import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import { Popover } from 'antd';

import ReferredByInput from "../../components/ReferredByInput";
import { QuestionCircleOutlined } from "@ant-design/icons";
import UserProfileReferralCode from './UserProfileReferralCode';

const atilaPointsPopoverContent = (
    <div>
        Get points for referring people to Atila to apply and start scholarships:
        <ul>
            <li>
                100 points for each person you refer to Atila
            </li>
            <li>
                If someone you refer wins a scholarship you get $50
            </li>
            <li>
                1,000 points if someone you refer starts a scholarship
            </li>
            <li>
                500 points, if they become a finalist
            </li>
            <li>
                People with the top 5 points every four months gets cash prizes and gifts
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
      render() {

        const {  userProfile } = this.props;

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
              <UserProfileReferralCode />
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