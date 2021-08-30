import React from 'react';
import {connect} from "react-redux";
import UserProfileSearch from '../../components/UserProfile/UserProfileSearch';
import MessagingCampaignAddEdit from './MessagingCampaignAddEdit';

class MessagingCampaign extends React.Component {

    constructor(props){
        super()
        this.state = {}

    }
   
    render(){

        return (
            <div className="container mt-5">
                <MessagingCampaignAddEdit />
                <UserProfileSearch />
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(MessagingCampaign);