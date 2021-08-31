import React from 'react';
import {toastNotify} from "../../models/Utils";
import { Table, Spin } from 'antd';
import TableUtils from '../../services/utils/TableUtils';
import QueryBuilder from '../Query/QueryBuilder';
import UserProfileAPI from '../../services/UserProfileAPI';


class UserProfileSearch extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            userProfiles: [],
            loading: null,
            addContactMode: false,
        };
    }
    /**
     * TODO: This is the same logic used in ContactsNetwork, is there a way to combine their logic together?
     * @param {*} queryData 
     */
    onUpdateQuery = (queryData) => {
        this.setState({loading: "Loading users..."});
        
        
        UserProfileAPI.list('query', queryData, "post")
            .then(res => {
                const { user_profiles: userProfiles } = res.data;
                
                this.setState({ userProfiles });
                if (userProfiles.length === 0) {
                    toastNotify("No users found matching selected query.");
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

        const { userProfiles, loading } = this.state;

        let columns = TableUtils.getTableColumnsFromObjects(userProfiles, "userprofile");

        return (
            <div className="w-100">
                <QueryBuilder onUpdateQuery={this.onUpdateQuery} queryType="userprofile" />
                <Table columns={columns} 
                       dataSource={userProfiles} 
                       rowKey="user"
                       loading={loading ? { indicator:<Spin />, tip:"Loading Users..."} : false}   
                       style={{ width: '100%', height: '100%' }}
                       scroll={{ x: 1300 }} />
            </div>
        );
    }
}

export default UserProfileSearch;