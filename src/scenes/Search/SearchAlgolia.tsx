import React, { useEffect, useRef, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, PoweredBy, Pagination, connectStateResults, SearchBox } from 'react-instantsearch-dom';
import 'instantsearch.css/themes/satellite.css'; //algolia instant search styling
import ScholarshipCard from '../Scholarship/ScholarshipCard';
import Environment from '../../services/Environment';
import qs from 'qs';
import Loading from '../../components/Loading';
import HelmetSeo from '../../components/HelmetSeo';

const algoliaClient = algoliasearch(Environment.ALGOLIA_APP_ID, Environment.ALGOLIA_PUBLIC_KEY);

const MINIMUM_CHARACTER_LENGTH = 3;
const DEBOUNCE_TIME = 400;

export function SearchResultHit(props: any) {

  const { hit } = props;
  if (hit.deadline && Number.isInteger(hit.deadline)) {
    if (new Date(hit.deadline).toISOString().startsWith("1970")) {
      // if the timestamp is giving an epoch date then it's probably in seconds and we should multiply by 1000 to convert to milliseconds
      hit.deadline = hit.deadline * 1000
    }
    hit.deadline = new Date(hit.deadline).toISOString();
}
  return (
    <ScholarshipCard scholarship={hit} className="col-12" />
  );
}

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
	
/**
 * Only show results when 3 or more characters are typed and let user know if no results were found.
 * https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-display/react/
 */
const Results = connectStateResults(
  ({ searchState, searchResults, children, isSearchStalled }: { searchState: any, searchResults: any, children: any, isSearchStalled: boolean}) => {

    if (!searchState?.query || searchState?.query?.length < 3) {
      return <div>Please type at least 3 characters</div>
    } else if (searchResults?.nbHits === 0) {
      return <div>No results have been found for {searchState.query}.</div>
    } else {
      return <>
      {isSearchStalled && <Loading title="Loading search results" />}
        {children}
      </>
    }
  }
);
	

const createURL = (state: any) => `?${qs.stringify(state)}`;

const searchStateToUrl = (searchState: any) =>
  searchState ? createURL(searchState) : '';

const urlToSearchState = ({ search, match=null }: { search: any, match: any}) => qs.parse(search.slice(1));


function SearchAlgolia({ location, history }: { location: any, history: any }) {

  const [searchState, setSearchState] = useState(urlToSearchState(location));
  // TODO find a way to get searchResults and use it in the HelmetSEO
  // const [searchResults, _setSearchResults] = useState<any>({});
  const debouncedSetStateRef = useRef<null|any>(null);

  function onSearchStateChange(updatedSearchState: any) {
    clearTimeout(debouncedSetStateRef.current);

    debouncedSetStateRef.current = setTimeout(() => {
      history.push(searchStateToUrl(updatedSearchState));
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

  return (
    <div className="SearchAlgolia container p-5">
    <HelmetSeo content={seoContent} />    
    <InstantSearch searchClient={searchClient} 
                   indexName={`${Environment.name}_scholarship_index"`} 
                   searchState={searchState} 
                   onSearchStateChange={onSearchStateChange}
                   createURL={createURL}>
        <SearchBox  className="mb-3" searchAsYouType={false} showLoadingIndicator/>
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
