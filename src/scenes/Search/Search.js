import React from 'react';

import SearchApi from "../../services/SearchAPI";
import ResponseDisplay from "../../components/ResponseDisplay";
import {SearchResultsDisplay} from "./SearchResultsDisplay";
import Form from "react-bootstrap/Form";
import {Link} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import {Helmet} from "react-helmet";

class Search extends React.Component {

    constructor(props) {
        super(props);


        const {
            location : { search },
        } = this.props;
        const params = new URLSearchParams(search);
        const searchQuery = params.get('q') || '';

        this.state = {
            searchQuery,
            searchResults: null,
            isLoadingResponse: null,
            responseError: null,
            responseOkMessage: null,
        }
    }

    componentDidMount() {

        const { searchQuery } = this.state;
        if (searchQuery) {
            this.loadItems();
        }
    };

    loadItems = () => {

        const { searchQuery } = this.state;
        this.setState({ isLoadingResponse: true });

        SearchApi.search(searchQuery)
            .then(res => {
                console.log({res});
                this.setState({ searchResults: res.data });

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
        this.setState({searchQuery: event.target.value});
    };

    submitSearch = event => {
        event.preventDefault();
        const { searchQuery } = this.state;
        this.props.history.push({
            pathname: '/search',
            search: `?q=${searchQuery}`
        });
        this.loadItems();
    };

    render () {

        const {isLoadingResponse, responseError, responseOkMessage, searchResults, searchQuery} = this.state;

        return (
            <div className="container mt-5">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Search - {searchQuery} - Atila</title>
                </Helmet>
                <h1>Search {searchQuery && `for ${searchQuery}`}</h1>

                <Form inline  onSubmit={this.submitSearch} className="my-3">
                    <input value={searchQuery}
                           className="form-control search-input col-sm-12 col-md-6 mr-md-1 offset-md-1"
                           type="text"
                           name="search"
                           placeholder="Enter a search term" onChange={this.updateSearch}/>
                    <button className="btn btn-primary col-md-4 col-sm-12"
                            type="submit">
                        Search
                    </button>
                </Form>

                { searchResults &&
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
