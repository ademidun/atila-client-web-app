import React from 'react';
import ContactsNetworkForm from './ContactsNetworkForm';
import ContactsNetworkGraph from './ContactsNetworkGraph';
import ContactsAPI from "../../services/ContactsAPI";
import { Button } from 'antd';
import ContactAddEdit from './ContactsAddEdit';

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
    }

    toggleAddContacts = () => {
        this.setState({addContactMode: !this.state.addContactMode})
    }

    render() {

        const { contacts, addContactMode } = this.state;

        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <h1>Visualize the Student Clubs Network</h1>
                    <Button onClick={this.toggleAddContacts}>
                        Add contact
                    </Button>

                    {addContactMode && 
                        <ContactAddEdit />
                    }

                    <ContactsNetworkForm onUpdateContacts={this.updateContacts} />
                    <ContactsNetworkGraph contacts={contacts} />
                    
                    </div>
            </div>
        );
    }
}

export default ContactsNetwork;