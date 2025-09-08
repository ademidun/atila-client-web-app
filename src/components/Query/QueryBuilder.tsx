import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Tag } from 'antd';
import { CopyOutlined } from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import { getRandomString, prettifyKeys, copyToClipboard } from '../../services/utils';
import { ALL_DEMOGRAPHICS } from '../../models/ConstantsForm';
import { updateCurrentUserProfileQuery } from '../../redux/actions/query';
import { connect } from 'react-redux';
import { convertQueryListToDynamicQuery, DEFAULT_SAMPLE_SEARCHES, getDefaultQueryItem, SampleSearches } from './QueryBuilderHelper';
import { ConnectedComponent } from 'react-redux';
import QueryItem from './QueryItem';

interface QueryData {
    [key: string]: string;
}

interface QueryItem {
    id: string;
    queryType: 'and' | 'or';
    queryData: QueryData;
}

interface QueryBuilderProps {
    onQueryUpdate: (query: any) => void;
    updateQueryPropsOnLoad: boolean;
    sampleSearches: any[];
    queryType: string;
    currentUserProfileQuery: QueryItem[];
    updateCurrentUserProfileQuery: (queries: QueryItem[]) => void;
}

const getDefaultQueryItemTyped = (): QueryItem => ({
    id: getRandomString(8),
    queryType: 'and',
    queryData: {}
});

const QueryBuilder: React.FC<QueryBuilderProps> = ({
    onQueryUpdate,
    updateQueryPropsOnLoad = true,
    sampleSearches = DEFAULT_SAMPLE_SEARCHES,
    queryType = "contact",
    currentUserProfileQuery,
    updateCurrentUserProfileQuery
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [allQueries, setAllQueries] = useState<QueryItem[]>([getDefaultQueryItemTyped()]);
    const [sampleSearchesState, setSampleSearchesState] = useState(sampleSearches);

    const initializeQueryFromUrlString = (): QueryItem[] => {
        const queries: QueryItem[] = [];
        const params = new URLSearchParams(location.search);
        const validFields = ["all_fields", ...Object.keys(ALL_DEMOGRAPHICS)];

        for (let [key, value] of params) {
            const queryItem: QueryItem = { ...getDefaultQueryItemTyped() };
            const queryTypes = ["and", "or"] as const;
            
            for (const queryType of queryTypes) {
                const queryPrefix = `__${queryType}__`;
                if (key.startsWith(queryPrefix)) {
                    queryItem.queryType = queryType;
                    key = key.replace(queryPrefix, "");
                }
            }

            if (validFields.includes(key)) {
                queryItem.queryData[key] = prettifyKeys(value);
                queries.push(queryItem);
            }
        }

        return queries;
    };

    const convertQueryListToUrl = (): string => {
        let queryUrl = `${window.location.origin}${window.location.pathname}`;
        
        allQueries.forEach((query, index) => {
            let queryKey = Object.keys(query.queryData)[0];
            const queryValue = query.queryData[queryKey];
            queryKey = query.queryType === "or" ? `__or__${queryKey}` : queryKey;

            let queryAsParam = `${queryKey}=${queryValue}`;
            queryAsParam = index === 0 ? `?${queryAsParam}` : `&${queryAsParam}`;
            queryUrl = `${queryUrl}${queryAsParam}`;
        });

        return queryUrl.replace(/ /g, "+");
    };

    const copyQueryUrlToClipboard = () => {
        const queryUrl = convertQueryListToUrl();
        copyToClipboard(queryUrl);
    };

    const refreshQuery = () => {
        const queries = initializeQueryFromUrlString();

        if (queries.length > 0 && Object.keys(queries[0].queryData).length > 0) {
            setAllQueries(queries);
        }
        if (updateQueryPropsOnLoad) {
            updateQueryProps(queries);
        }
    };

    useEffect(() => {
        refreshQuery();
        window.scrollTo(0, 0);
    }, [location.search]);

    const addQuery = (queryType: 'and' | 'or') => {
        setAllQueries(prevQueries => {
            const newQueries = [...prevQueries];
            
            if (newQueries.length === 1) {
                newQueries[0].queryType = queryType;
            }
            
            newQueries.push({
                id: getRandomString(8),
                queryType,
                queryData: {},
            });
            
            return newQueries;
        });
    };

    const removeQuery = (index: number) => {
        setAllQueries(prevQueries => {
            const newQueries = [...prevQueries];
            newQueries.splice(index, 1);
            return newQueries;
        });
        updateQueryProps(allQueries.filter((_, i) => i !== index));
    };

    const handleQueryUpdate = (query: QueryData, index: number) => {
        setAllQueries(prevQueries => {
            const newQueries = [...prevQueries];
            newQueries[index].queryData = query;
            return newQueries;
        });

        if (queryType === "userprofile") {
            updateCurrentUserProfileQuery(allQueries.map((q, i) => 
                i === index ? { ...q, queryData: query } : q
            ));
        }

        updateQueryProps(allQueries.map((q, i) => 
            i === index ? { ...q, queryData: query } : q
        ));
    };

    const updateQueryProps = (queries: QueryItem[]) => {
        const dynamicQuery = convertQueryListToDynamicQuery(queries);
        onQueryUpdate(dynamicQuery);
    };

    const displayQueries = queryType === "userprofile" ? currentUserProfileQuery : allQueries;
    const mostRecentQuery = displayQueries[displayQueries.length - 1];
    const mostRecentQueryHasValue = Object.keys(mostRecentQuery.queryData).length > 0;
    const CopyIcon = CopyOutlined as unknown as React.FC;

    return (
        <div>
            {displayQueries.map((query, index) => {
                const queryValue = Object.keys(query.queryData).length > 0 
                    ? query.queryData[Object.keys(query.queryData)[0]] 
                    : "";
                const queryKey = Object.keys(query.queryData).length > 0 
                    ? Object.keys(query.queryData)[0] 
                    : "";

                return (
                    <div key={query.id}>
                        <QueryItem
                            onUpdateQuery={(queryData) => handleQueryUpdate(queryData, index)}
                            placeHolder={queryValue}
                            value={queryValue}
                            queryType={queryType}
                            queryKey={queryKey}
                        />
                        {displayQueries.length > 1 && (
                            <div className="mb-3">
                                <Button onClick={() => removeQuery(index)} type="link">
                                    Remove Query
                                </Button>
                                <br />
                            </div>
                        )}
                    </div>
                );
            })}
            <>
                <Button onClick={() => addQuery("and")} disabled={!mostRecentQueryHasValue}>
                    And
                </Button>
                <Button onClick={() => addQuery("or")} disabled={!mostRecentQueryHasValue}>
                    Or
                </Button>
            </>
            <br />
            <SampleSearches 
                sampleSearches={sampleSearchesState} 
                allQueries={displayQueries} 
                onSearchSelected={handleQueryUpdate} 
            />
            <div>
                {displayQueries.map((query, index) => (
                    <React.Fragment key={index}>
                        {index !== 0 && (
                            <>
                                {' '}
                                <Tag color="blue">{prettifyKeys(query.queryType)}</Tag>
                            </>
                        )}
                        {Object.keys(query.queryData).length > 0 && (
                            <>
                                <strong>{prettifyKeys(Object.keys(query.queryData)[0])}</strong> is{' '}
                                {query.queryData[Object.keys(query.queryData)[0]]}
                            </>
                        )}
                    </React.Fragment>
                ))}
            </div>
            {mostRecentQueryHasValue && (
                <div className="float-left mt-3">
                    <Button onClick={copyQueryUrlToClipboard}>
                        Save the Link to this query to clipboard{' '}
                        <CopyOutlined style={{ fontSize: '16px', color: '#1890ff' }} className="copy-icon" />
                    </Button>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state: any) => ({
    currentUserProfileQuery: state.data.query.currentUserProfileQuery
});

const mapDispatchToProps = {
    updateCurrentUserProfileQuery
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryBuilder); 