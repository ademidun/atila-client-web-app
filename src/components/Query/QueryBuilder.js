import React, {Fragment} from 'react';
import { withRouter } from "react-router-dom";
import { Button, Tag } from 'antd';
import PropTypes from "prop-types";
import QueryItem from './QueryItem';
import { CopyOutlined } from "@ant-design/icons";
import { getRandomString, prettifyKeys, copyToClipboard } from '../../services/utils';
import { ALL_DEMOGRAPHICS } from '../../models/ConstantsForm';

/**
    * Render a list of example searches and when a search item is clicked, 
    * set the queryData of most recent search item in the list of queries to the selected searchItem
    * @param {*} searchItem 
*/

// Usages of DEFAULT_QUERY_ITEM need to be passed as a shallow copy using Object.assign() to avoid multiple array items sharing the same reference.
// It also has to be used as a function so that getRandomString(8) is new each time
const getDefaultQueryItem = () => ({
    // useful for setting the queryBuilderKey without having to use index which breaks when the question order changes
    // e.g. when we remove a QuestionItem that isn't the last question
    // TODO use this same logic in the Scholarship Question Builder?
    id: getRandomString(8),
    queryType: "and",
    // TODO change queryData to have a category and value key so we no longer have to use Object.keys(queryData)[0] to get the key names.
    queryData: {},
});

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

/**
 * Query builder creates a query form based on the Mongodb document querying syntax
 * https://docs.mongodb.com/manual/tutorial/query-documents/
 * https://github.com/ademidun/atila-django/issues/328
 */
 class QueryBuilder extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            allQueries: [getDefaultQueryItem()],
            sampleSearches: [
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
            ]
        };

    }

    /**
     * Given a URL string such as:
     * /clubs?eligible_schools=university%20of%20Toronto&eligible_programs=Engineering&__or__eligible_schools=university%20of%20alberta&&__or__eligible_schools=humber%20college
     * Generate a list of all queries.
     * Queryies can be prefixed with __or__[attribute_name] to indicate that it is an OR query
     */
    intializeQueryFromUrlString = () => {
        const allQueries = [];
        const {
            location : { search },
        } = this.props;

        const params = new URLSearchParams(search);

        const validFields = ["all_fields", ...Object.keys(ALL_DEMOGRAPHICS)];

        for (let [key, value] of params) {
            const queryItem = Object.assign({}, getDefaultQueryItem());
            const queryTypes = ["and", "or"];
            for (const queryType of queryTypes) {
                const queryPrefix = `__${queryType}__`;
                if (key.startsWith(queryPrefix)) {
                    queryItem.queryType = queryType;
                    key = key.replace(queryPrefix, "")
                }
            }

            if (validFields.includes(key)) {
                queryItem.queryData[key] = prettifyKeys(value);
                allQueries.push(queryItem);
            }
        }

        return allQueries;
    }

    convertQueryListToUrl = () => {
        let queryUrl = `${window.location.origin}${window.location.pathname}`;
        console.log({queryUrl});

        const { allQueries } = this.state;
        
        allQueries.forEach((query, index) => {

            let queryKey = Object.keys(query.queryData)[0];
            const queryValue = query.queryData[queryKey];
            queryKey = query.queryType === "or" ? `__or__${queryKey}` : queryKey;


            let queryAsParam = `${queryKey}=${queryValue}`

            queryAsParam = index === 0 ? `?${queryAsParam}` : `&${queryAsParam}`;
            queryUrl = `${queryUrl}${queryAsParam}`;
        });
        console.log({queryUrl, window});

        return queryUrl


    }

    copyQueryUrlToClipboard = () => {

        let queryUrl = this.convertQueryListToUrl();
        copyToClipboard(queryUrl);
    }

    componentDidMount() {
        const { updateQueryPropsOnLoad } = this.props;
        const allQueries = this.intializeQueryFromUrlString();
        
        if(allQueries.length > 0 && Object.keys(allQueries[0].queryData).length > 0) {
            this.setState({allQueries});
        }
        if (updateQueryPropsOnLoad) {
            this.updateQueryProps(allQueries);
        }

    }

    addQuery = (queryType) => {

        const { allQueries } = this.state;

        // If this is the second query, then set the first query to be relative to the current query
        // E.g. if the first query is AND by default but the second query is OR, then the first query should also be OR
        if (allQueries.length === 1) {
            allQueries[0].queryType = queryType;
        }
        allQueries.push({
            id: getRandomString(8),
            queryType,
            queryData: {},
        });
        this.setState({allQueries});
    }

    removeQuery = (index) => {

        const { allQueries } = this.state;

        allQueries.splice(index, 1);
        this.setState({allQueries});

        this.updateQueryProps(allQueries);
    }

    onUpdateQuery = (query, index) => {

        const { allQueries } = this.state;

        allQueries[index].queryData = query;
        this.setState({allQueries});

        this.updateQueryProps(allQueries);

    }

    updateQueryProps = (allQueries) => {
        const dynamicQuery = this.convertQueryListToDynamicQuery(allQueries);

        this.props.onUpdateQuery(dynamicQuery);
    }
    /**
     * Convert a list of query items to a dynamic query object in Mongodb style querying.
     * https://github.com/ademidun/atila-django/issues/328
     * @param {*} queryList 
     */
    convertQueryListToDynamicQuery = (queryList) => {
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

    render() {
        const { allQueries, sampleSearches } = this.state;
        const mostRecentQuery = allQueries[allQueries.length - 1];
        const mostRecentQueryHasValue =  Object.keys(mostRecentQuery.queryData).length > 0; 

        return (
            <div>
                {allQueries.map((query, index) => {
                    const queryValue =  Object.keys(query.queryData).length > 0 ? query.queryData[Object.keys(query.queryData)[0]] : ""; 

                    return (

                    <div key={query.id}>
                        <QueryItem  onUpdateQuery={(queryData) => {this.onUpdateQuery(queryData, index)}} placeHolder={queryValue} />
                        {allQueries.length > 1 && 
                        <div className="mb-3">
                        <Button onClick={() => {this.removeQuery(index)}} type="link">
                            Remove Query
                        </Button>
                        <br/>
                        </div>
                        }
                    </div>
                
                    )
                })}
                <>
                <Button onClick={() => {this.addQuery("and")}} disabled={!mostRecentQueryHasValue}>
                    And
                </Button>

                <Button onClick={() => {this.addQuery("or")}} disabled={!mostRecentQueryHasValue}>
                    Or
                </Button>
                </>
                <br/>
                <SampleSearches sampleSearches={sampleSearches} allQueries={allQueries} onSearchSelected={this.onUpdateQuery} />
                <div>
                {allQueries.map((query, index) => (
                    <Fragment key={index}>
                    {index !==0 && 
                    <>{' '}
                    <Tag color="blue">{prettifyKeys(query.queryType)}</Tag>
                    </>
                    }
                    {Object.keys(query.queryData).length > 0 &&
                        <>
                        <strong>{prettifyKeys(Object.keys(query.queryData)[0])}</strong> is {query.queryData[Object.keys(query.queryData)[0]]}
                        </>
                    }
                    </Fragment>
                ))}

                </div>
                
                {mostRecentQueryHasValue && 
                <div className="float-left mt-3">

                
                <Button onClick={this.copyQueryUrlToClipboard}>
                Save the Link to this query to clipboard{' '}<CopyOutlined />
                </Button>
            </div>
                }
                                
            </div>
        );
    }
}

QueryBuilder.defaultProps = {
    onUpdateQuery: (query) => {},
    updateQueryPropsOnLoad: true,
};

QueryBuilder.propTypes = {
    onUpdateQuery: PropTypes.func.isRequired,
    updateQueryPropsOnLoad: PropTypes.bool.isRequired,
};

export default withRouter(QueryBuilder);