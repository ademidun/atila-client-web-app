import React, { useEffect, useRef, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, PoweredBy, Pagination, SearchBox, Configure } from 'react-instantsearch-dom';
import 'instantsearch.css/themes/satellite.css'; //algolia instant search styling
import Environment from '../../services/Environment';
import qs from 'qs';
import HelmetSeo from '../../components/HelmetSeo';
import { Results, SearchResultHit } from './SearchResults';
import './Search.scss'

const algoliaClient = algoliasearch(Environment.ALGOLIA_APP_ID, Environment.ALGOLIA_PUBLIC_KEY);

const MINIMUM_CHARACTER_LENGTH = 3;
const DEBOUNCE_TIME = 400;

// customize search client to prevent sending a search on initial load
// https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-requests/react/
const searchClient = {
  ...algoliaClient,
  search(requests: any) {
    if (requests.every(({ params }: { params: any}) => !params.query || params.query.length < MINIMUM_CHARACTER_LENGTH)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
        })),
      });
    }

    return algoliaClient.search(requests);
  },
};


	

const createURL = (state: any) => `?${qs.stringify(state)}`;

const searchStateToUrl = (searchState: any) =>{
  const searchStateCopy = Object.assign({}, searchState);
  // remove hits per page configuration from showing in the url so that the URLs look clean and simple
  // otherwise, your URL looks like: http://localhost:3000/search?query=canada&page=2&configure%5BhitsPerPage%5D=8
  // Alternate example without encoding: http://localhost:3000/search?query=canada&page=2&configure[hitsPerPage]=8
  delete searchStateCopy.configure?.hitsPerPage;
  const searchStateUrl = searchState ? createURL(searchStateCopy) : '';
  return searchStateUrl;
}

const urlToSearchState = ({ search, match=null }: { search: any, match: any}) => {
  const searchState = qs.parse(search.slice(1));
  console.log({searchState});
  return searchState;
};


function SearchAlgolia({ location, history }: { location: any, history: any }) {

  const [searchState, setSearchState] = useState(urlToSearchState(location));
  // TODO find a way to get searchResults and use it in the HelmetSEO
  // const [searchResults, _setSearchResults] = useState<any>({});
  const debouncedSetStateRef = useRef<null|any>(null);

  function onSearchStateChange(updatedSearchState: any) {
    clearTimeout(debouncedSetStateRef.current);

    debouncedSetStateRef.current = setTimeout(() => {
      history.push(searchStateToUrl(updatedSearchState));
      window.scrollTo(0,0)
    }, DEBOUNCE_TIME);

    setSearchState(updatedSearchState);
  }

  useEffect(() => {
    setSearchState(urlToSearchState(location));
  }, [location]);

  const seoContent = {
    title: searchState.query ? `${searchState.query} - Search`: 'Search',
    // TODO find a way to get searchResults and use it in the HelmetSEO
    // description: `${searchResults?.nbHits > 0 ? `${searchResults?.nbHits} `: ''} Scholarships, Blogs, and Essays search results${searchState.query ? ` for ${searchState.query}`: ''}`,
    description: `Scholarships, Blogs, and Essays search results${searchState.query ? ` for ${searchState.query}`: ''}`,
    slug: `/search?query=${searchState.query}`
  };
  const indexName = `${Environment.name}_scholarship_index`;

  return (
    <div className="Search container p-md-5">
    <HelmetSeo content={seoContent} />    
    <InstantSearch searchClient={searchClient} 
                   indexName={indexName} 
                   searchState={searchState} 
                   onSearchStateChange={onSearchStateChange}
                   createURL={createURL}>
          <Configure
          hitsPerPage={8}
        />
        <SearchBox  className="mb-3" 
                    searchAsYouType={false} 
                    showLoadingIndicator />
        <Results>
          <Hits hitComponent={SearchResultHit} />
        </Results>
        <Pagination  className="my-3" />
        <PoweredBy  className="mb-3" />
    </InstantSearch>
    </div>
  )
}

export default SearchAlgolia
