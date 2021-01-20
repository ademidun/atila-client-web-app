import React from 'react';

import SearchApi from "../../services/SearchAPI";
import ResponseDisplay from "../../components/ResponseDisplay";
import {SearchResultsDisplay} from "./SearchResultsDisplay";
import AutoComplete from "../../components/AutoComplete";
import {MASTER_LIST_EVERYTHING_UNDERSCORE} from "../../models/ConstantsForm";
import AnalyticsService from "../../services/AnalyticsService";
import {slugify, unSlugify} from "../../services/utils";
import HelmetSeo from "../../components/HelmetSeo";

class Search extends React.Component {

    constructor(props) {
        super(props);


        const {
            location : { search },
        } = this.props;
        const params = new URLSearchParams(search);
        const searchQuery = unSlugify(params.get('q') || '');

        this.state = {
            searchQuery,
            prevSearchQuery: null,
            searchResults: null,
            isLoadingResponse: !!searchQuery,
            responseError: null,
            responseOkMessage: null,
        }
    }

    componentDidMount() {
        // Redirect to /search if necessary
        if (!this.props.location.pathname.includes("/search")) {
            const { urlQuery } = this.props.match.params

            if (urlQuery) {
                this.props.history.push({
                    pathname: '/search',
                    search: `?q=${slugify(urlQuery)}`
                });
            } else {
                this.props.history.push({
                    pathname: '/search'
                });
            }
        }
        const { searchQuery } = this.state;
        if (searchQuery) {
            this.loadItems();
        }
    };

    static getDerivedStateFromProps(props, state) {
        // see ScholarshipDetail.getDerivedStateFromProps() for more details on how this works.
        const {
            location : { search },
        } = props;
        const params = new URLSearchParams(search);
        const searchQuery = unSlugify(params.get('q') || '');
        const { prevSearchQuery } = state;

        if (searchQuery !== prevSearchQuery) {
            return {
                ...state,
                searchQuery,
                prevSearchQuery: searchQuery,
                searchResults: null
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        const { searchResults, responseError, prevSearchQuery } = this.state;
        const {
            location : { search },
        } = this.props;
        const params = new URLSearchParams(search);
        const searchQuery = unSlugify(params.get('q') || '');

        if (searchResults === null && !responseError && searchQuery !== prevSearchQuery) {
            this.loadItems();
        }
    }

    loadItems = () => {

        const { searchQuery } = this.state;

        SearchApi.search(searchQuery)
            .then(res => {
                this.setState({ searchResults: res.data });
                const search_results = {
                    search_query: searchQuery,
                    metadata: res.data.metadata,
                    results_count: {
                        scholarships: res.data.scholarships.length,
                        blogPosts: res.data.blogPosts.length,
                        essays: res.data.essays.length,
                    },
                    type: 'search',
                };
                AnalyticsService.saveSearchAnalytics({search_results}, null).then();

            })
            .catch(err => {
                this.setState({responseError : err });
            })
            .finally(() => {
                this.setState({ isLoadingResponse: false });
            });
    };

    updateSearch = event => {
        event.preventDefault();
        const searchQuery = unSlugify(event.target.value);
        this.setState({searchQuery}, () => {
            this.submitSearch();
        });
    };

    submitSearch = event => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        const { searchQuery } = this.state;
        this.props.history.push({
            pathname: '/search',
            search: `?q=${slugify(searchQuery)}`
        });
        this.setState({ isLoadingResponse: true }, () => {
            this.loadItems();
        });
    };

    render () {

        const {isLoadingResponse, responseError, responseOkMessage, searchResults, searchQuery} = this.state;

        const customTheme = {
            container: 'react-autosuggest__container col-sm-12 col-md-7 p-0 my-3 mx-1',
        };


        const seoContent = {
            title: searchQuery? `${searchQuery} - Search`: 'Search',
            description: `Scholarships, Blogs, and Essays for ${searchQuery}`,
            slug: `/search?q=${searchQuery}`
        };

        if (searchResults) {
            let allResultsCount = 0;
            ['scholarships', 'blogPosts', 'essays'].forEach(type => {
                if (searchResults[type]) {
                    allResultsCount += searchResults[type].length;
                }
            });

            if(allResultsCount > 0) {
                seoContent.title += ` (${allResultsCount} results) `;
                seoContent.description = `${allResultsCount} Scholarships, Blogs, and Essays for ${searchQuery}`;

            }

        }

        return (
            <div className="container mt-5">
                <HelmetSeo content={seoContent} />

                <h1>Search {searchQuery && `for ${searchQuery}`}</h1>

                <form  onSubmit={this.submitSearch} className="row">

                    <AutoComplete suggestions={MASTER_LIST_EVERYTHING_UNDERSCORE}
                                  placeholder={"Enter search here"}
                                  onSelected={this.updateSearch}
                                  value={searchQuery}
                                  customTheme={customTheme}
                                  keyName='search'/>
                    <button className="btn btn-primary col-md-4 col-sm-12 my-3 mx-1"
                            type="submit">
                        Search
                    </button>
                </form>

                { searchResults && (searchResults.scholarships || searchResults.essays || searchResults.blogs) &&
                <SearchResultsDisplay searchResults={searchResults} />
                }
                <ResponseDisplay isLoadingResponse={isLoadingResponse}
                                 responseError={responseError}
                                 responseOkMessage={responseOkMessage} />
            </div>
        );
    }
}
export default Search;
