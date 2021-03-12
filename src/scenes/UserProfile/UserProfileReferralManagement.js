import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import { Popover } from 'antd';

import ReferredByInput from "../../components/ReferredByInput";
import { QuestionCircleOutlined } from "@ant-design/icons";
import UserProfileReferralCode from './UserProfileReferralCode';
import UserProfileReferredUsers from './UserProfileReferredUsers';
import { POINTS_FOR_CREATING_AN_ACCOUNT, POINTS_FOR_STARTING_A_SCHOLARSHIP,
     POINTS_FOR_BEING_A_SCHOLARSHIP_FINALIST, POINTS_FOR_BEING_A_SCHOLARSHIP_WINNER } from '../../models/AtilaPoints';

const atilaPointsPopoverContent = (
    <div>
        Get money and points for referring people to Atila and completing tasks:
        <ul>
            <li>
                {POINTS_FOR_CREATING_AN_ACCOUNT} points for each person you refer to Atila
            </li>
            <li>
                If someone you refer wins a scholarship you both get $50 <br/>
            </li>
            <li>
                If you win a scholarship you get {POINTS_FOR_BEING_A_SCHOLARSHIP_WINNER * 2} points
            </li>
            <li>
                If you refer someone who wins a scholarship you get {POINTS_FOR_BEING_A_SCHOLARSHIP_WINNER} points
            </li>
            <li>
                {POINTS_FOR_STARTING_A_SCHOLARSHIP} points if someone you refer starts a scholarship + 20% commision
            </li>
            <li>
                {/* You get {POINTS_FOR_BEING_A_SCHOLARSHIP_FINALIST * 2} if you are a scholarship finalist */}
                You get {POINTS_FOR_BEING_A_SCHOLARSHIP_FINALIST} points, if you refer someone that is a finalist
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
            <hr />
            <UserProfileReferredUsers />
          </div>
        );
      }


}
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(UserProfileReferralManagement);