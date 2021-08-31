import React from 'react';
import ContactsAPI from "../../services/ContactsAPI";
import {toastNotify} from "../../models/Utils";
import { Table, Spin } from 'antd';
import TableUtils from '../../services/utils/TableUtils';
import QueryBuilder from '../../components/Query/QueryBuilder';


class ContactsTable extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            contacts: [],
            loading: null,
            addContactMode: false,
        };
    }
    /**
     * TODO: This is the same logic used in ContactsNetwork, is there a way to combine their logic together?
     * @param {*} queryData 
     */
    onUpdateQuery = (queryData) => {
        this.setState({loading: "Loading clubs..."});
        ContactsAPI.query(queryData)
            .then(res => {
                const { contacts } = res.data;
                
                this.setState({ contacts });
                if (contacts.length === 0) {
                    toastNotify("No clubs found matching selected query.");
                }
            })
            .catch(err=> {
                console.log({err});
                toastNotify("There was problem with your search, please try another one.", "error");
            })
            .finally(()=>{
                this.setState({loading: null})
            })
    }

    toggleAddContacts = () => {
        this.setState({addContactMode: !this.state.addContactMode})
    }

    render() {

        const { contacts, loading } = this.state;

        let columns = TableUtils.getTableColumnsFromObjects(contacts);

        return (
            <div className="w-100">
                <QueryBuilder onUpdateQuery={this.onUpdateQuery} />
                <Table columns={columns} 
                       dataSource={contacts} 
                       rowKey="id"
                       loading={loading ? { indicator:<Spin />, tip:"Loading Contacts..."} : false}   
                       style={{ width: '100%', height: '100%' }} />
            </div>
        );
    }
}

export default ContactsTable;