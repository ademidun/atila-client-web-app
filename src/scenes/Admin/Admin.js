import React from 'react';
import ContactAddEdit from '../Contact/ContactAddEdit';
import ContactsTable from '../Contact/ContactsTable';
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import {connect} from "react-redux";
import { Tabs } from 'antd';
import UserSearch from './UserSearch';
const { TabPane } = Tabs;

class Admin extends React.Component {

    constructor(props){
        super()
        this.state = {}

    }
   
    render(){
        
        const { loggedInUserProfile } = this.props;

        if (!loggedInUserProfile || !loggedInUserProfile.is_atila_admin) {
            return (
                <div className="card shadow p-3">
                    <h1>Only Admin users can view this page</h1>
                </div>
            )
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
                    <Tabs defaultActiveKey="users">
                        <TabPane tab="Users" key="users">
                            <UserSearch />
                        </TabPane>
                        <TabPane tab="Contacts" key="contacts">
                            <div style={{width: "100%"}}>
                                <ContactsTable />
                            </div>
                            <ContactAddEdit />   
                        </TabPane>
                    </Tabs> 
                </div>
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(Admin);