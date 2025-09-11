import {useCallback, useEffect, useRef, useState} from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, PoweredBy, Pagination, SearchBox, Configure, connectHitInsights, connectHits } from 'react-instantsearch-dom';
import 'instantsearch.css/themes/satellite.css'; //algolia instant search styling
import Environment from '../../services/Environment';
import qs from 'qs';
import HelmetSeo from '../../components/HelmetSeo';
import {SearchResultHit, SearchResults} from './SearchResults';
import './Search.scss'
import aa from 'search-insights';
import {Tab, Tabs} from 'react-bootstrap';
import equal from "fast-deep-equal";
import { useNavigate } from 'react-router-dom';
import { SearchConfig } from './SearchConfig';
import { Hit, BasicDoc } from 'react-instantsearch-core';
import React from 'react';
import { HitsGrid } from '../../components/Search/AlgoliaComponents';


const algoliaClient = algoliasearch(Environment.ALGOLIA_APP_ID, Environment.ALGOLIA_PUBLIC_KEY);

aa('init', {
  appId: Environment.ALGOLIA_APP_ID,
  apiKey: Environment.ALGOLIA_PUBLIC_KEY,
  useCookie: true,
})

const SearchResultHitsWithInsights = connectHitInsights(aa)(SearchResultHit);
const MINIMUM_CHARACTER_LENGTH = 3;
const DEBOUNCE_TIME = 400;
const HITS_PER_PAGE = 5;

const NOW_TIMESTAMP = Date.now();

// customize search client to prevent sending a search on initial load
// https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-requests/react/
const createSearchClient = (resultsCB: any) => {
  return {
  ...algoliaClient,
  search(requests: any) {// requests is actually of type MultipleQueriesQuery[], but importing the type isn't working
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

    // replace hyphens with spaces so search terms like atila.ca/s/stem-scholarship return relevant results
    requests.forEach((indexRequest: any) => {
      indexRequest.params.query = indexRequest.params.query.replace('-', ' ');
    });
    let res = algoliaClient.search(requests);
    res.then(response => resultsCB(response.results))
    return res
  },
}
};


	

const createURL = (state: any) => `?${qs.stringify(state)}`;


const urlToSearchState = ({ search}: { search: any}) => {
  const searchState = qs.parse(search.slice && search.slice(1));
  // ?q=<term> should set the same search state as ?query=<term>
  if(searchState.q && !searchState.query) {
    searchState.query = searchState.q;
    delete searchState.q;
  }
  return searchState;
};


interface SearchAlgoliaProps {
  className: string,
  renderSeo: boolean,
  location?: any,
  initialSearch?: string,
  searchConfig?: SearchConfig,
  onResultsLoaded?: (results: Array<{ items: any, num_items: number }>) => void,
  onSearchQueryChanged?: (searchQuery: any) => void,
}

function SearchAlgolia({ className = "p-md-5",
                         renderSeo = true,
                         location = "",
                         initialSearch = "",
                         searchConfig = {showScholarships: true, showMentors: true, showBlogs: true},
                         onResultsLoaded = () => {},
                         onSearchQueryChanged = () => {},
                       }: SearchAlgoliaProps) {

  const navigate = useNavigate();

  const [searchState, setSearchState] = useState(urlToSearchState(location));
  const [showExpiredScholarships] = useState(false);
  const [results, setResults] = useState<any[]>([{'hits': []}]);


  const debouncedSetStateRef = useRef<null|any>(null);

  const handleSearchStateChange = useCallback(
    (updatedSearchState: any) => {
        
    clearTimeout(debouncedSetStateRef.current);

    debouncedSetStateRef.current = setTimeout(() => {
      const searchTerm = updatedSearchState.query;
      if (searchTerm) {
        const newUrl = `/search?q=${encodeURIComponent(searchTerm)}`;
        navigate(newUrl, { replace: true });
      }
      setSearchState(updatedSearchState);
      onSearchQueryChanged(updatedSearchState)
    }, DEBOUNCE_TIME);

    },
    [navigate, onSearchQueryChanged]
  );

  /**
   * If a search string was passed in as a prop, update the search state
   */
  useEffect(() => {
    if (initialSearch) {
      handleSearchStateChange({query: initialSearch})
    }
  }, [initialSearch, handleSearchStateChange])

  /**
   * Everytime the url changes or the showExpiredScholarships option is toggled, update the searchstate based on what's in the URL
   */
  useEffect(() => {
    setSearchState(urlToSearchState(location));
  }, [location, showExpiredScholarships]);

  const seoContent = {
    title: searchState.query ? `${searchState.query} - Search`: 'Search',
    // TODO find a way to get searchResults and use it in the HelmetSEO
    // description: `${searchResults?.nbHits > 0 ? `${searchResults?.nbHits} `: ''} Scholarships, Blogs, and Essays search results${searchState.query ? ` for ${searchState.query}`: ''}`,
    description: `Scholarships, Blogs, and Essays search results${searchState.query ? ` for ${searchState.query}`: ''}`,
    slug: `/search?query=${searchState.query}`
  };
  // Use the Algolia staging index for the demo environment (demo.atila.ca)
  let algoliaIndexPrefix = Environment.name;
  if (algoliaIndexPrefix === "demo") {
    algoliaIndexPrefix = "staging";
  }

  const scholarshipIndex = Environment.ALGOLIA_SCHOLARSHIP_INDEX;
  const scholarshipConfiguration: any = {};
  if (!showExpiredScholarships) {
    // the deadline is saved in seconds in our index so we have to convert the current date from milliseconds to seconds;
    const nowTimestampInSeconds = Math.round( NOW_TIMESTAMP / 1000 );
    scholarshipConfiguration.filters = `deadline >= ${nowTimestampInSeconds}`;
  }

  const algoliaResultsToOnResultsLoaded = (searchResults: any) => {
    return searchResults.map((res: any) => {
      return {
        items: res.hits,
        num_items: res.nbHits,
      }
    })
  }

  const handleSearchResultsChange = (searchResults: any) => {
    let callBackResults = algoliaResultsToOnResultsLoaded(searchResults)
    onResultsLoaded(callBackResults)
    if (!equal(results, searchResults)) {
      setResults(searchResults)
    }
  }

  const {showScholarships, showMentors, showBlogs} = searchConfig;

  let searchClient = createSearchClient(handleSearchResultsChange);

  interface SearchHit extends Hit<BasicDoc> {
    title: string;
    description: string;
    [key: string]: any; // Allow for dynamic properties from Algolia
  }

  const HitsGridInner = ({ hits }: { hits: SearchHit[] }) => (
    <HitsGrid hits={hits} hitComponent={SearchResultHitsWithInsights as any} />
  );

  const ConnectedHitsGrid = connectHits<SearchHit>(HitsGridInner);

  // Create wrapper components to handle type assertions

  const scholarshipResults = [
    React.createElement(Configure as any, { hitsPerPage: HITS_PER_PAGE }),
    React.createElement(SearchResults as any, { title: "Scholarships" },
      React.createElement(ConnectedHitsGrid as any)
    ),
    React.createElement(Pagination as any, { className: "my-3" })
  ];

  const blogSearchResults = results.find(result => result?.index?.includes('blog_index'));
  const blogResults = [
    React.createElement(Configure as any, { hitsPerPage: HITS_PER_PAGE }),
    React.createElement(SearchResults as any, { title: "Blogs" },
      React.createElement(ConnectedHitsGrid as any)
    ),
    React.createElement(Pagination as any, { className: "my-3" })
  ];

  const mentorSearchResults = results.find(result => result?.index?.includes('mentor_index'));
  const mentorResults = [
    React.createElement(Configure as any, { hitsPerPage: HITS_PER_PAGE }),
    React.createElement(SearchResults as any, { title: "Mentors" },
      React.createElement(ConnectedHitsGrid as any)
    )
  ];

  const showInTabs = showScholarships && showBlogs && showMentors;
  return (
    <div className={`Search container ${className}`}>
    {renderSeo && <HelmetSeo content={seoContent} />}
    {React.createElement(InstantSearch as any, {
      searchClient,
      indexName: scholarshipIndex,
      searchState,
      onSearchStateChange: handleSearchStateChange,
      createURL
    }, [
      React.createElement(Configure as any, { clickAnalytics: true }),
      React.createElement(SearchBox as any, {
        className: "mb-3",
        searchAsYouType: false,
        showLoadingIndicator: true
      }),
      React.createElement(PoweredBy as any, { className: "mb-3" }),

      showInTabs ? 
      React.createElement(Tabs as any, { defaultActiveKey: "scholarships", transition: false, id: "SearchViewTabs" }, [
        React.createElement(Tab as any, { 
          eventKey: 'scholarships', 
          title: `Scholarships ${results[0]?.nbHits ? ` (${results[0].nbHits})` : ''}`
        }, scholarshipResults),
        React.createElement(Tab as any, { 
          eventKey: 'blogs', 
          title: `Blogs ${blogSearchResults?.nbHits ? ` (${blogSearchResults.nbHits})` : ''}`
        }, blogResults),
        React.createElement(Tab as any, { 
          eventKey: 'mentors', 
          title: `Mentors ${mentorSearchResults?.nbHits ? ` (${mentorSearchResults.nbHits})` : ''}`
        }, mentorResults)
      ]) : 
      <>
        {showScholarships && scholarshipResults}
        {showBlogs && blogResults}
        {showMentors && mentorResults}
      </>
    ])}
    </div>
  )
}

export default SearchAlgolia;
