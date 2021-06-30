import React from 'react';
import ContactsNetworkGraph from './Graph/ContactsNetworkGraph';
import ContactsAPI from "../../services/ContactsAPI";
import { Button } from 'antd';
import ContactAddEdit from './ContactAddEdit';
import ContactsNetworkInformation from './ContactsNetworkInformation';
import {toastNotify} from "../../models/Utils";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import QueryBuilder from '../../components/Query/QueryBuilder';
import { CONTACTS_QUERY_RESPONSE_1 } from '../../mock_data/ContactsQuery';
import Environment from '../../services/Environment';

const TEMP_HACK_LOCAL_DATA = true;

class ContactsNetwork extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            contacts: [],
            loading: null,
            addContactMode: false,
        };
    }

    componentDidMount() {
        this.setState({loading: "Loading All Contacts..."});
        let contacts;

        // TODO change this value to be read from localhost instead of setting it to true for all users
        // and rename it to MOCK_LOCAL_DATA
        if (TEMP_HACK_LOCAL_DATA && Environment.name === "dev") {
            contacts = CONTACTS_QUERY_RESPONSE_1.contacts;
            this.setState({ contacts });
        }

        ContactsAPI
            .getAllContacts()
            .then(res => {
                contacts = res.data.contacts;
                this.setState({contacts})
            })
            .finally(()=>{
                this.setState({loading: null})
            })
    }

    onUpdateQuery = (queryData) => {

        ContactsAPI.query(queryData)
            .then(res => {
                const { contacts } = res.data;
                
                this.setState({ contacts });
                if (contacts.length === 0) {
                    toastNotify("No clubs found matching selected query.")
                }
            })
            .catch(err=> {
                console.log({err});
            })

        
    }

    toggleAddContacts = () => {
        this.setState({addContactMode: !this.state.addContactMode})
    }

    render() {

        const { contacts, addContactMode } = this.state;
        const pageTitle = "Student Clubs Network Visualizer"
        const seoContent = {
            ...defaultSeoContent,
            title: pageTitle
        };

        return (
            <div className="container mt-5">
                <HelmetSeo content={seoContent}/>
                <div className="card shadow p-3">
                    <h1>The {pageTitle}</h1>
                    <h5 className="text-muted text-center">
                        Visually explore the relationships between every student club in Canada
                    </h5>

                    <QueryBuilder onUpdateQuery={this.onUpdateQuery} />
                    <div style={{with: "150px"}} className="mb-3">
                        <div className="float-right">

                            Are we missing a club?{' '}
                            <Button onClick={this.toggleAddContacts}>
                                {addContactMode ? "Hide ": ""}Add club
                            </Button>
                        </div>

                    </div>

                    {addContactMode && 
                        <ContactAddEdit />
                    }
                    <ContactsNetworkGraph contacts={contacts} />
                    <ContactsNetworkInformation />
                    
                    </div>
            </div>
        );
    }
}

export default ContactsNetwork;