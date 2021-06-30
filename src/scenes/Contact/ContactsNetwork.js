import React from 'react';
import ContactsNetworkGraph from './ContactsNetworkGraph';
import ContactsAPI from "../../services/ContactsAPI";
import { Button } from 'antd';
import ContactAddEdit from './ContactAddEdit';
import ContactsNetworkInformation from './ContactsNetworkInformation';
import {toastNotify} from "../../models/Utils";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import QueryBuilder from '../../components/Query/QueryBuilder';
import { CONTACTS_QUERY_RESPONSE_1 } from '../../mock_data/ContactsQuery';
import Environment from '../../services/Environment';

const TEMP_HACK_LOCAL_DATA = false;

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
        this.setState({loading: "Loading All Contacts..."})

        ContactsAPI
            .getAllContacts()
            .then(res => {
                const { contacts } = res.data;
                this.setState({contacts})
            })
            .finally(()=>{
                this.setState({loading: null})
            })
    }

    onUpdateQuery = (queryData) => {

        ContactsAPI.query(queryData)
            .then(res => {
                let { contacts } = res.data;

                if (TEMP_HACK_LOCAL_DATA && Environment.name === "dev") {
                    contacts = CONTACTS_QUERY_RESPONSE_1.contacts;
                }
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
        const seoContent = {
            ...defaultSeoContent,
            title: "Atila - Student Clubs Network Visualizer"
        };

        return (
            <div className="container mt-5">
                <HelmetSeo content={seoContent}/>
                <div className="card shadow p-3">
                    <h1>The Student Clubs Network Visualizer</h1>
                    <h5 className="text-muted text-center">
                        Visually explore the relationship between every student club in Canada
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