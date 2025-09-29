import React, { useState } from 'react';
import { connect } from "react-redux";
import { MASTER_LIST_WITH_CATEGORY_LABEL, MASTER_LIST_WITH_CATEGORY_LABEL_ADMIN, MASTER_LIST_WITH_CATEGORY_LABEL_USER_PROFILE } from '../../models/ConstantsForm';
import AutoComplete, { Suggestion } from '../AutoComplete';
import { Tag, Radio, Input, Button } from 'antd';
import { prettifyKeys } from '../../services/utils';

interface UserProfile {
    is_atila_admin: boolean;
    [key: string]: any;
}

interface QueryItemProps {
    onUpdateQuery: (query: { [key: string]: string }) => void;
    value: string;
    queryKey: string;
    placeHolder?: string;
    loggedInUserProfile?: UserProfile;
    queryType: string;
}

const queryBuilder = 'queryBuilder';
const customQuery = 'customQuery';

const queryInputTypes = [
    { label: 'Query Builder', value: queryBuilder },
    { label: 'Custom Query', value: customQuery },
];

const QueryItem = ({
    onUpdateQuery = () => {},
    value = "",
    queryKey = "",
    placeHolder,
    loggedInUserProfile,
    queryType = "contact"
}: QueryItemProps) => {
    const [queryInputType, setQueryInputType] = useState(
        queryKey && queryKey.includes("__") ? customQuery : queryBuilder
    );
    const [customQueryKey, setCustomQueryKey] = useState(
        queryKey && queryKey.includes("__") ? queryKey : ""
    );
    const [customQueryValue, setCustomQueryValue] = useState(
        queryKey && queryKey.includes("__") ? value : ""
    );

    const onSuggestionSelected = (event: React.FormEvent, suggestionArguments: { suggestion: Suggestion; suggestionValue?: string }) => {
        const { suggestion, suggestionValue } = suggestionArguments;

        let queryData: { [key: string]: string } = {};
        if (!suggestion) {
            queryData = {
                "all_fields": suggestionValue || "",
            };
        } else {
            queryData = {
                [suggestion.category!]: suggestion.value,
            };
        }

        if (queryData.school) {
            queryData.eligible_schools = queryData.school;
            delete queryData.school;
        }
        if (queryData.program) {
            queryData.eligible_programs = queryData.program;
            delete queryData.program;
        }

        onUpdateQuery(queryData);
    };

    const renderSuggestion = (suggestion: Suggestion) => (
        <p className="suggestion-item cursor-pointer">
            {suggestion.value}{' '}
            <Tag>{prettifyKeys(suggestion.category)}</Tag>
        </p>
    );

    const onChangeQueryInputType = (e: any) => {
        setQueryInputType(e.target.value);
    };

    const onCustomQueryUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'customQueryKey') {
            setCustomQueryKey(value);
        } else if (name === 'customQueryValue') {
            setCustomQueryValue(value);
        }
    };

    const onCustomQueryEntered = () => {
        const queryData = {
            [customQueryKey]: customQueryValue
        };
        onUpdateQuery(queryData);
    };

    const inputToSuggestion = (input: string): Suggestion => ({
        category: "all_fields",
        value: input
    });

    let suggestions = MASTER_LIST_WITH_CATEGORY_LABEL;
    if (loggedInUserProfile?.is_atila_admin) {
        suggestions = MASTER_LIST_WITH_CATEGORY_LABEL_ADMIN;
    }
    if (queryType === "userprofile") {
        suggestions = MASTER_LIST_WITH_CATEGORY_LABEL_USER_PROFILE;
    }

    return (
        <>
            {loggedInUserProfile?.is_atila_admin && (
                <Radio.Group
                    className="mb-2"
                    options={queryInputTypes}
                    onChange={onChangeQueryInputType}
                    value={queryInputType}
                    optionType="button"
                    buttonStyle="solid"
                />
            )}

            {queryInputType === customQuery && (
                <>
                    <Input.Group compact>
                        <Input
                            style={{ width: "50%" }}
                            placeholder="Field"
                            name="customQueryKey"
                            value={customQueryKey}
                            onChange={onCustomQueryUpdate}
                            onPressEnter={onCustomQueryEntered}
                        />
                        <Input
                            className="site-input-right"
                            style={{ width: "50%" }}
                            placeholder="Value"
                            name="customQueryValue"
                            value={customQueryValue}
                            onChange={onCustomQueryUpdate}
                            onPressEnter={onCustomQueryEntered}
                        />
                    </Input.Group>

                    <Button onClick={onCustomQueryEntered} className="my-3">
                        Search
                    </Button>
                </>
            )}

            {queryInputType === queryBuilder && (
                <AutoComplete
                    suggestions={suggestions}
                    placeholder={placeHolder || "Search by school, program, ethnicity, activity, industry, or more"}
                    value={value}
                    getSuggestionValue={(suggestion: Suggestion) => suggestion.value}
                    renderSuggestion={renderSuggestion}
                    onSuggestionSelected={onSuggestionSelected}
                    inputToSuggestion={inputToSuggestion}
                    keyName={'searchString'}
                    onSelected={() => {}}
                />
            )}
        </>
    );
};

const mapStateToProps = (state: any) => ({
    loggedInUserProfile: state.data.user.loggedInUserProfile
});

export default connect(mapStateToProps)(QueryItem); 