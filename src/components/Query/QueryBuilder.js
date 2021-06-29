import React from 'react';
import { Button, Tag } from 'antd';
import PropTypes from "prop-types";
import { QueryItem } from './QueryItem';
import { prettifyKeys } from '../../services/utils';


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
                    queryType: "and",
                    queryData: {},
                }
            ]
        };

    }

    addQuery = (queryType) => {

        const { allQueries } = this.state;

        allQueries.push({
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

    onUpdateQuery = (query) => {

        this.props.onUpdateQuery(query)
    }

    render() {
        const { allQueries } = this.state;

        return (
            <div>
                {allQueries.map((query, index) => (
                    <>
                    <QueryItem key={index} onUpdateQuery={this.onUpdateQuery} /> 
                    {allQueries.length > 1 && 
                    <div className="mb-3">
                    <Button onClick={() => {this.removeQuery(index)}} type="link">
                        Remove Query
                    </Button>
                    <Tag color="blue">{prettifyKeys(query.queryType)}</Tag>
                    <br/>
                    </div>
                    }
                    </>
                ))}

                <Button onClick={() => {this.addQuery("and")}}>
                    And
                </Button>

                <Button onClick={() => {this.addQuery("or")}}>
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

