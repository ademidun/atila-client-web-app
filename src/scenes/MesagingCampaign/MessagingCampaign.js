import React from 'react';
import PropTypes from "prop-types";
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
                <UserProfileSearch onUpdateQuery={this.onUpdateQuery} />
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};
MessagingCampaign.defaultProps = {
    onUpdateQuery: (query) => {},
};

MessagingCampaign.propTypes = {
    onUpdateQuery: PropTypes.func.isRequired
};
export default connect(mapStateToProps)(MessagingCampaign);