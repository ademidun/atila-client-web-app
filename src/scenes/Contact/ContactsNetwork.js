import React, { useState } from 'react';
import ContactsNetworkGraph from './Graph/ContactsNetworkGraph';
import ContactsAPI from "../../services/ContactsAPI";
import { Button } from 'antd';
import ContactAddEdit from './ContactAddEdit';
import ContactsNetworkInformation from './ContactsNetworkInformation';
import { toastNotify } from "../../models/Utils";
import HelmetSeo, { defaultSeoContent } from "../../components/HelmetSeo";
import QueryBuilder from '../../components/Query/QueryBuilder';
import Loading from "../../components/Loading";

function ContactsNetwork() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(null);
    const [addContactMode, setAddContactMode] = useState(false);

    const onUpdateQuery = (queryData) => {
        setLoading("Loading clubs...");
        ContactsAPI.queryStudentClubs(queryData)
            .then(res => {
                const { contacts: newContacts } = res.data;
                setContacts(newContacts);
                
                if (newContacts.length === 0) {
                    toastNotify("No clubs found matching selected query.");
                }
            })
            .catch(err => {
                console.log({ err });
                toastNotify("There was problem with your search, please try another one.", "error");
            })
            .finally(() => {
                setLoading(null);
            });
    };

    const toggleAddContacts = () => {
        setAddContactMode(prev => !prev);
    };

    const pageTitle = "Student Clubs Network Visualizer";
    const pageSubTitle = "Visually explore every student club in Canada";

    const seoContent = {
        ...defaultSeoContent,
        title: `${pageTitle} ${pageSubTitle}`
    };

    return (
        <div className="container mt-5">
            <HelmetSeo content={seoContent} />
            <div className="card shadow p-3">
                <h1>The {pageTitle}</h1>
                <h5 className="text-muted text-center">
                    {pageSubTitle}
                </h5>

                <QueryBuilder onUpdateQuery={onUpdateQuery} />
                {loading && <Loading title={loading} />}
                
                <div style={{ width: "150px" }} className="mb-3">
                    <div className="float-right">
                        Are we missing a club?{' '}
                        <Button onClick={toggleAddContacts}>
                            {addContactMode ? "Hide " : ""}Add club
                        </Button>
                    </div>
                </div>

                {addContactMode && <ContactAddEdit />}
                <ContactsNetworkGraph contacts={contacts} />
                <ContactsNetworkInformation />
            </div>
        </div>
    );
}

export default ContactsNetwork;