import React, {Fragment} from 'react';
import { Button } from 'antd';
import { getRandomString } from "../../services/utils";

/**
 * Convert a list of query items that renders a query builder
 * to a dynamic query object in Mongodb style querying that will be used for querying the dataabse.
 * https://github.com/ademidun/atila-django/issues/328
 * @param {*} queryList 
 */
 export function convertQueryListToDynamicQuery(queryList){
    let dynamicQuery = {};
    queryList.forEach(query => {

        const { queryType, queryData } = query;
        const queryKey = Object.keys(queryData).length > 0 ? Object.keys(queryData)[0] : "";
        if (queryType === "or") {
            if (!dynamicQuery["$or"]) {
                dynamicQuery["$or"] = []
            }
            dynamicQuery["$or"].push(queryData);
        } else if (queryKey && dynamicQuery[queryKey]) { //if the dynamicQuery already has this attribute, add it to the $and array
            if (!dynamicQuery["$and"]) {
                dynamicQuery["$and"] = []
            }
            dynamicQuery["$and"].push(queryData);
        } else {
            dynamicQuery = {
                ...dynamicQuery,
                ...queryData
            }
        }
        
    });

    return dynamicQuery;

}

export function convertDynamicQueryToQueryList(dynamicQuery) {
    let queryList = [];

    Object.keys(dynamicQuery).forEach(queryKey => {
        
        if (queryKey === "$or" || queryKey === "$and" )  {
            dynamicQuery[queryKey].forEach(queryItem => {
                const queryRow = {
                    id: getRandomString(8),
                    queryType: queryKey.substring(1),// to get just "or" or "and" from "$or" or "$and"
                    queryData: queryItem
                };
                queryList.push(queryRow);
            })
        } else {
            const queryRow = {
                id: getRandomString(8),
                queryType: "and",
                queryData: {
                    [queryKey]: dynamicQuery[queryKey]
                },
            };
            queryList.push(queryRow);
        }
    });

    return queryList;
}


/**
    * Render a list of example searches and when a search item is clicked, 
    * set the queryData of most recent search item in the list of queries to the selected searchItem
    * @param {*} searchItem 
*/

// Usages of DEFAULT_QUERY_ITEM need to be passed as a shallow copy using Object.assign() to avoid multiple array items sharing the same reference.
// It also has to be used as a function so that getRandomString(8) is new each time
export const getDefaultQueryItem = () => ({
    // useful for setting the queryBuilderKey without having to use index which breaks when the question order changes
    // e.g. when we remove a QuestionItem that isn't the last question
    // TODO use this same logic in the Scholarship Question Builder?
    id: getRandomString(8),
    queryType: "and",
    // TODO change queryData to have a category and value key so we no longer have to use Object.keys(queryData)[0] to get the key names.
    queryData: {},
});

export const DEFAULT_SAMPLE_SEARCHES = [
    {category: 'eligible_schools', value: 'University of Toronto'},
    {category: 'eligible_schools', value: 'University of Alberta'},
    {category: 'eligible_schools', value: 'Dalhouse University'},
    {category: 'eligible_schools', value: 'Humber College'},
    {category: 'eligible_programs', value: 'Nursing'},
    {category: 'eligible_programs', value: 'Medicine'},
    {category: 'occupations', value: 'Software Engineer'},
    {category: 'industries', value: 'Investment Banking'},
    {category: 'industries', value: 'Management Consulting'},
    {category: 'religion', value: 'Christianity'},
    {category: 'religion', value: 'Judaism'},
    {category: 'religion', value: 'Islam'},
    {category: 'ethnicity', value: 'East-Asian'},
    {category: 'ethnicity', value: 'South-Asian'},
    {category: 'ethnicity', value: 'Black'},
    {category: 'ethnicity', value: 'Indigenous'},
    {category: 'other_demographic', value: 'STEM'},
    {category: 'other_demographic', value: 'Women'},
    {category: 'other_demographic', value: 'LGBTQ'},
    {category: 'sports', value: 'Weightlifting'},
    {category: 'sports', value: 'Basketball'},
];

export const SampleSearches = ({sampleSearches, allQueries, onSearchSelected, className="my-3"}) => {

    
    return (<div className={className}>
        <strong>Sample Searches: </strong>
        {
            sampleSearches.map ((searchItem, index) => {

                let queryData = {[searchItem.category]: searchItem.value};
                return (<Fragment key={index}>
                    <Button onClick={() => {onSearchSelected(queryData, allQueries.length -1)}} type="link" className="p-0">
                        {searchItem.value}
                    </Button>{index !== sampleSearches.length -1 &&  <>{', '}</>}
                </Fragment>)
            })
        }
    </div>)

}