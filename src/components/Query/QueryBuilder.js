import React, {Fragment} from 'react';
import { Button, Tag } from 'antd';
import PropTypes from "prop-types";
import { QueryItem } from './QueryItem';
import { getRandomString, prettifyKeys } from '../../services/utils';


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
                    queryData: {},
                }
            ]
        };

    }

    addQuery = (queryType) => {

        const { allQueries } = this.state;

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
    }

    onUpdateQuery = (query, index) => {


        const { allQueries } = this.state;

        allQueries[index].queryData = query;
        this.setState({allQueries});

        this.props.onUpdateQuery(query);
        console.log({allQueries});
    }

    render() {
        const { allQueries } = this.state;
        const mostRecentQuery = allQueries[allQueries.length - 1];
        const mostRecentQueryHasValue =  Object.keys(mostRecentQuery.queryData).length > 0; 

        return (
            <div>
                {allQueries.map((query, index) => {

                    return (

                    <div key={query.id}>
                        <QueryItem  onUpdateQuery={(queryData) => {this.onUpdateQuery(queryData, index)}} />
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

                    

                <Button onClick={() => {this.addQuery("and")}} disabled={!mostRecentQueryHasValue}>
                    And
                </Button>

                <Button onClick={() => {this.addQuery("or")}} disabled={!mostRecentQueryHasValue}>
                    Or
                </Button>
                                
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

