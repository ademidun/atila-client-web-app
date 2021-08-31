import React, {Fragment} from 'react';
import { withRouter } from "react-router-dom";
import { Button, Tag } from 'antd';
import PropTypes from "prop-types";
import QueryItem from './QueryItem';
import { CopyOutlined } from "@ant-design/icons";
import { getRandomString, prettifyKeys, copyToClipboard } from '../../services/utils';
import { ALL_DEMOGRAPHICS } from '../../models/ConstantsForm';
import { updateCurrentUserProfileQuery } from '../../redux/actions/query';
import { connect } from 'react-redux';
import { convertQueryListToDynamicQuery, DEFAULT_SAMPLE_SEARCHES, getDefaultQueryItem, SampleSearches } from './QueryBuilderHelper';

/**
 * Query Builder creates a list of query items that is rendered in the UI and transforms it 
 * into a dynamic query object that is used for querying in the database.
 * This dynamic query object can then be transformed back into a list of query items when returned
 * from the database.
 * See EXPECTED_QUERY_LIST and EXPECTED_QUERY_OBJECT in QueryBuilder.test.js for the expected data formats.
 * https://docs.mongodb.com/manual/tutorial/query-documents/
 * https://github.com/ademidun/atila-django/issues/328
 */
 class QueryBuilder extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            allQueries: [getDefaultQueryItem()],
            sampleSearches: props.sampleSearches
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
        // replaces all instances of " " with "+"
        queryUrl = queryUrl.replace(/ /g, "+")
        return queryUrl
    }

    copyQueryUrlToClipboard = () => {
        let queryUrl = this.convertQueryListToUrl();
        copyToClipboard(queryUrl);
    }

    componentDidMount() {
        this.refreshQuery()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.search !== this.props.location.search) {
            this.refreshQuery()
            window.scrollTo(0,0)
        }
    }

    refreshQuery = () => {
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
        const { queryType, updateCurrentUserProfileQuery } = this.props;

        allQueries[index].queryData = query;
        this.setState({allQueries});

        if (queryType === "userprofile") {
            updateCurrentUserProfileQuery(allQueries);
        }

        this.updateQueryProps(allQueries);

    }

    updateQueryProps = (allQueries) => {
        const { onUpdateQuery } = this.props;
        const dynamicQuery = convertQueryListToDynamicQuery(allQueries);

        onUpdateQuery(dynamicQuery);
    }

    render() {
        let { allQueries, sampleSearches } = this.state;
        const { queryType, currentUserProfileQuery } = this.props;
        const mostRecentQuery = allQueries[allQueries.length - 1];
        const mostRecentQueryHasValue =  Object.keys(mostRecentQuery.queryData).length > 0; 

        if( queryType === "userprofile" ) {
            allQueries = currentUserProfileQuery;
        }

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

const mapStateToProps = state => {
    return { 
        currentUserProfileQuery: state.data.query.currentUserProfileQuery 
    };
};

const mapDispatchToProps = {
    updateCurrentUserProfileQuery
};

QueryBuilder.defaultProps = {
    onUpdateQuery: (query) => {},
    updateQueryPropsOnLoad: true,
    sampleSearches: DEFAULT_SAMPLE_SEARCHES,
    queryType: "contact",
};

QueryBuilder.propTypes = {
    onUpdateQuery: PropTypes.func.isRequired,
    updateQueryPropsOnLoad: PropTypes.bool.isRequired,
    sampleSearches: PropTypes.array.isRequired,
    queryType: PropTypes.string.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(QueryBuilder));