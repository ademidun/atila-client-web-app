import React from 'react';
import {toastNotify} from "../../models/Utils";
import { Table, Spin } from 'antd';
import DataUtils from '../../services/utils/DataUtils';
import QueryBuilder from '../Query/QueryBuilder';
import UserProfileAPI from '../../services/UserProfileAPI';


class UserProfileSearch extends React.Component {

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
        
        
        UserProfileAPI.list('query', queryData, "post")
            .then(res => {
                const { user_profiles: contacts } = res.data;
                
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

        let columns = DataUtils.getTableColumnsFromObjects(contacts);

        return (
            <div className="w-100">
                <QueryBuilder onUpdateQuery={this.onUpdateQuery} queryType="userprofile" />
                <Table columns={columns} 
                       dataSource={contacts} 
                       rowKey="id"
                       loading={loading ? { indicator:<Spin />, tip:"Loading Contacts..."} : false}   
                       style={{ width: '100%', height: '100%' }} />
            </div>
        );
    }
}

export default UserProfileSearch;