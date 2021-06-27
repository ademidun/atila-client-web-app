import React from 'react';
import {  MASTER_LIST_WITH_CATEGORY_LABEL } from '../../models/ConstantsForm';
import AutoComplete from '../../components/AutoComplete';
import { Tag } from 'antd';
import ContactsAPI from '../../services/ContactsAPI';


class ContactsNetworkForm extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            handleChange: '',
            contacts: []
        };

    }

    onSuggestionSelected = (event, suggestionArguments ) => {
        console.log({ suggestionArguments });
        
        const { suggestion } = suggestionArguments;

        const queryData = {
            [suggestion.category]: suggestion.value,
        };

        if(queryData.school) {
            queryData.eligible_schools = queryData.school;
            delete queryData.school;
        } if(queryData.program) {
            queryData.eligible_programs = queryData.program;
            delete queryData.program;
        } if(queryData.other_demographic) {
            queryData.other_demographics = queryData.other_demographic;
            delete queryData.other_demographic;
        }

        ContactsAPI.query(queryData)
            .then(res => {
                console.log({res});
            })
            .catch(err=> {
                console.log({err});
            })
    };


    renderSuggestion = suggestion => (
        <p className="suggestion-item cursor-pointer">
            {suggestion.value}{' '}
            <Tag>{suggestion.category}</Tag>
        </p>
    );

    renderSuggestion = suggestion => (
        <p className="suggestion-item cursor-pointer">
            {suggestion.value}{' '}
            <Tag>{suggestion.category}</Tag>
        </p>
    );

    render() {
        const { searchQuery } = this.state;

        return (
            <div style={{"height": "250px"}}>
                <AutoComplete   suggestions={MASTER_LIST_WITH_CATEGORY_LABEL}
                                placeholder={"Search by school, city, program, ethnicity or more"}
                                value={searchQuery}
                                getSuggestionValue={suggestion => suggestion.value}
                                renderSuggestion={this.renderSuggestion}
                                onSuggestionSelected={this.onSuggestionSelected}
                                keyName={'searchString'}/>
            </div>
        );
    }
}

export default ContactsNetworkForm;