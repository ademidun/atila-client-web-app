import React from 'react';
import ContactsNetworkForm from './ContactsNetworkForm';
import ContactsNetworkGraph from './ContactsNetworkGraph';
import ContactsAPI from "../../services/ContactsAPI";

class ContactsNetwork extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            contacts: [],
            loading: null,
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

    render() {

        const { contacts } = this.state;

        return (
            <div className="container mt-5">
                <div className="card shadow p-3">
                    <h1>Visualize Contacts Network</h1>

                    <ContactsNetworkForm contacts={contacts} />
                    <ContactsNetworkGraph contacts={contacts} />
                    
                    </div>
            </div>
        );
    }
}

export default ContactsNetwork;