import React from 'react';
import ContactAddEdit from '../scenes/Contact/ContactAddEdit';
import ContactsTable from '../scenes/Contact/ContactsTable';
import HelmetSeo, {defaultSeoContent} from "../components/HelmetSeo";
import {connect} from "react-redux";

class Admin extends React.Component {

    constructor(props){
        super()
        this.state = {}

    }
   
    render(){
        
        const { loggedInUserProfile } = this.props;

        if (!loggedInUserProfile || !loggedInUserProfile.is_atila_admin) {
            return null
        }
        const title = "Admin Dashboard";

        const seoContent = {
            ...defaultSeoContent,
            title
        };

        return (
            <div className="container mt-5">
                <HelmetSeo content={seoContent}/>
                <div className="card shadow p-3">
                    <h1>{title}</h1>
                    <div style={{width: "100%"}}>
                        <ContactsTable />
                    </div>
                    <ContactAddEdit />    
                </div>
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(Admin);