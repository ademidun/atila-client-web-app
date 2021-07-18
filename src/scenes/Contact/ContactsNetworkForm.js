import React from 'react';
import {  MASTER_LIST_WITH_CATEGORY_LABEL } from '../../models/ConstantsForm';
import AutoComplete from '../../components/AutoComplete';
import { Tag } from 'antd';
import ContactsAPI from '../../services/ContactsAPI';
import PropTypes from "prop-types";
import { prettifyKeys } from '../../services/utils';


class ContactsNetworkForm extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            handleChange: '',
            contacts: []
        };

    }

    onSuggestionSelected = (event, suggestionArguments ) => {
        
        const { suggestion, suggestionValue } = suggestionArguments;

        let queryData = {};
        if (!suggestion) {
            // TODO for some reason sometime suggestion is being passed as a string, isntead of an object
            // likely a bug elsewhere, so we should find the underlying cause isntead of relying on this hotfix
            queryData = {
                "all_fields": suggestionValue,
            };
        } else {
            queryData = {
                [suggestion.category]: suggestion.value,
            };
        }

        if(queryData.school) {
            queryData.eligible_schools = queryData.school;
            delete queryData.school;
        } if(queryData.program) {
            queryData.eligible_programs = queryData.program;
            delete queryData.program;
        }

        ContactsAPI.query(queryData)
            .then(res => {
                const { contacts } = res.data;
                this.props.onUpdateContacts(contacts);
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
            <Tag>{prettifyKeys(suggestion.category)}</Tag>
        </p>
    );

    /**
     * If the user passes in an input string that is not one of the autocomplete options, save it as all_fields
     * option that will search all fields in the database.
     * @param {*} input 
     * @returns 
     */
    inputToSuggestion = input => (
        {
            category: "all_fields",
            value: input
        }
    )

    render() {
        const { searchQuery } = this.state;

        return (
            <div>
                <AutoComplete   suggestions={MASTER_LIST_WITH_CATEGORY_LABEL}
                                placeholder={"Search by school, city, program, ethnicity or more"}
                                value={searchQuery}
                                getSuggestionValue={suggestion => suggestion.value}
                                renderSuggestion={this.renderSuggestion}
                                onSuggestionSelected={this.onSuggestionSelected}
                                inputToSuggestion={this.inputToSuggestion}
                                keyName={'searchString'}/>
            </div>
        );
    }
}
ContactsNetworkForm.defaultProps = {
    onUpdateContacts: (contacts) => {},
};

ContactsNetworkForm.propTypes = {
    onUpdateContacts: PropTypes.func,
};

export default ContactsNetworkForm;