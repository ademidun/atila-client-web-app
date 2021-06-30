import React, {Fragment} from 'react';
import { Button, Tag } from 'antd';
import PropTypes from "prop-types";
import { QueryItem } from './QueryItem';
import { getRandomString, prettifyKeys } from '../../services/utils';

/**
    * Render a list of example searches and when a search item is clicked, 
    * set the queryData of most recent search item in the list of queries to the selected searchItem
    * @param {*} searchItem 
*/
    
export const SampleSearches = ({sampleSearches, allQueries, onSearchSelected, className="my-3"}) => {

    console.log({sampleSearches, allQueries, onSearchSelected});

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
            allQueries: [
                {
                    // useful for setting the queryBuilderKey without having to use index which breaks when the question order changes
                    // e.g. when we remove a QuestionItem that isn't the last question
                    // TODO use this same logic in the Scholarship Question Builder?
                    id: getRandomString(8),
                    queryType: "and",
                    // TODO change queryData to have a category and value key so we no longer have to use Object.keys(queryData)[0] to get the key names.
                    queryData: {},
                }
            ],
            sampleSearches: [
                {category: 'eligible_schools', value: 'University of Alberta'},
                {category: 'eligible_schools', value: 'Dalhouse University'},
                {category: 'eligible_schools', value: 'McMaster University'},
                {category: 'eligible_schools', value: 'Douglas College'},
                {category: 'eligible_programs', value: 'Nursing'},
                {category: 'eligible_programs', value: 'Finance'},
                {category: 'occupations', value: 'Software Engineer'},
                {category: 'religion', value: 'Christanity'},
                {category: 'religion', value: 'Judaism'},
                {category: 'religion', value: 'Islam'},
                {category: 'ethnicity', value: 'East-Asian'},
                {category: 'ethnicity', value: 'South-Asian'},
                {category: 'ethnicity', value: 'Black'},
                {category: 'other_demographic', value: 'Women'},
                {category: 'other_demographic', value: 'LGBTQ'},
                {category: 'sports', value: 'Ice Hockey'},
            ]
        };

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
        console.log({allQueries});
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
            if (queryType === "or") {
                if (!dynamicQuery["$or"]) {
                    dynamicQuery["$or"] = []
                }
                dynamicQuery["$or"].push(queryData)
            } else {
                dynamicQuery = {
                    ...dynamicQuery,
                    ...queryData
                }
            }
        });

        console.log({dynamicQuery});
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

                    console.log({query, queryValue});
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
                
                                
            </div>
        );
    }
}

QueryBuilder.defaultProps = {
    onUpdateQuery: (query) => {},
};

QueryBuilder.propTypes = {
    onUpdateQuery: PropTypes.func,
};

export default QueryBuilder;

