import React from 'react';
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {  MASTER_LIST_WITH_CATEGORY_LABEL, MASTER_LIST_WITH_CATEGORY_LABEL_ADMIN, MASTER_LIST_WITH_CATEGORY_LABEL_USER_PROFILE } from '../../models/ConstantsForm';
import AutoComplete from '../AutoComplete';
import { Tag } from 'antd';
import { prettifyKeys } from '../../services/utils';


export class QueryItem extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            searchQuery: props.value,
        };

    }

    onSuggestionSelected = (event, suggestionArguments ) => {
                
        const { suggestion, suggestionValue } = suggestionArguments;
        const { onUpdateQuery } = this.props;

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

        onUpdateQuery(queryData);
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
        const { placeHolder,loggedInUserProfile, queryType } = this.props;

        let suggestions = MASTER_LIST_WITH_CATEGORY_LABEL;
        if (loggedInUserProfile && loggedInUserProfile.is_atila_admin) {
            suggestions = MASTER_LIST_WITH_CATEGORY_LABEL_ADMIN;
        } if (queryType === "userprofile") {
            suggestions = MASTER_LIST_WITH_CATEGORY_LABEL_USER_PROFILE;
        }

        return (
            <>
                <AutoComplete   suggestions={suggestions}
                                placeholder={placeHolder||"Search by school, program, ethnicity, activity, industry, or more"}
                                value={searchQuery}
                                getSuggestionValue={suggestion => suggestion.value}
                                renderSuggestion={this.renderSuggestion}
                                onSuggestionSelected={this.onSuggestionSelected}
                                inputToSuggestion={this.inputToSuggestion}
                                keyName={'searchString'}/>
            </>
        );
    }
}

const mapStateToProps = state => {
    return { loggedInUserProfile: state.data.user.loggedInUserProfile };
};

QueryItem.defaultProps = {
    onUpdateQuery: (query) => {},
    value: "",
    queryType: "contact",
};

QueryItem.propTypes = {
    onUpdateQuery: PropTypes.func,
    placeHolder: PropTypes.string,
    loggedInUserProfile: PropTypes.shape({}).isRequired,
    queryType: PropTypes.string.isRequired
};

export default withRouter(connect(mapStateToProps)(QueryItem));