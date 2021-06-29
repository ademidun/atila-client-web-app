import React from 'react';
import ContactsNetworkForm from './ContactsNetworkForm';
import ContactsNetworkGraph from './ContactsNetworkGraph';
import ContactsAPI from "../../services/ContactsAPI";
import { Button } from 'antd';
import ContactAddEdit from './ContactAddEdit';
import ContactsNetworkInformation from './ContactsNetworkInformation';
import {toastNotify} from "../../models/Utils";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";

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

    updateContacts = (contacts) => {
        this.setState({ contacts });
        if (contacts.length === 0) {
            toastNotify("No clubs found matching selected query.")
        }
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
                    <h1>Visualize the Student Clubs Network</h1>

                    <ContactsNetworkForm onUpdateContacts={this.updateContacts} />
                    <div style={{with: "150px"}} className="mb-3">
                        <Button className="float-right" onClick={this.toggleAddContacts}>
                            {addContactMode ? "Hide ": ""}Add contact
                        </Button>
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