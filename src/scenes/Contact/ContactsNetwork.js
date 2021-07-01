import React from 'react';
import ContactsNetworkGraph from './Graph/ContactsNetworkGraph';
import ContactsAPI from "../../services/ContactsAPI";
import { Button } from 'antd';
import ContactAddEdit from './ContactAddEdit';
import ContactsNetworkInformation from './ContactsNetworkInformation';
import {toastNotify} from "../../models/Utils";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import QueryBuilder from '../../components/Query/QueryBuilder';
import Loading from "../../components/Loading";


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

        ContactsAPI
            .getAllContacts()
            .then(res => {
                const { contacts } = res.data;

                console.log({res});
                this.setState({contacts})
            })
            .finally(()=>{
                this.setState({loading: null})
            })
    }

    onUpdateQuery = (queryData) => {
        this.setState({loading: "Loading query..."});
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
            .finally(()=>{
                this.setState({loading: null})
            })
    }

    toggleAddContacts = () => {
        this.setState({addContactMode: !this.state.addContactMode})
    }

    render() {

        const { contacts, addContactMode, loading } = this.state;
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
                    {loading && <Loading title={loading} />}
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