import React, {SyntheticEvent, useCallback, useEffect, useRef, useState} from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, PoweredBy, Pagination, SearchBox, Configure, Index, connectHitInsights, connectSearchBox } from 'react-instantsearch-dom';
import 'instantsearch.css/themes/satellite.css'; //algolia instant search styling
import Environment from '../../services/Environment';
import qs from 'qs';
import HelmetSeo from '../../components/HelmetSeo';
import {SearchResultHit, SearchResults} from './SearchResults';
import './Search.scss'
import { Radio } from 'antd';
import aa from 'search-insights';
import equal from "fast-deep-equal";
import { RouteComponentProps, useHistory, withRouter } from 'react-router';
import AutoComplete from "../../components/AutoComplete";

const algoliaClient = algoliasearch(Environment.ALGOLIA_APP_ID, Environment.ALGOLIA_PUBLIC_KEY);
const algoliaQuerySuggestionIndexName = Environment.ALGOLIA_SCHOLARSHIP_QUERY_SUGGESTION_INDEX_NAME;

const VirtualSearchBox = connectSearchBox(() => null);

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

const searchStateToUrl = (searchState: any) =>{
  const searchStateCopy = Object.assign({}, searchState);
  // TODO remove hits per page configuration from showing in the url so that the URLs look clean and simple
  // otherwise, your URL looks like:
  // http://localhost:3000/search?query=canada&page=2&configure%5BhitsPerPage%5D=8
  // http://localhost:3000/search?query=scholarship&page=1&indices%5Bdev_scholarship_index%5D%5Bconfigure%5D%5BhitsPerPage%5D=8&indices%5Bdev_scholarship_index%5D%5Bpage%5D=2&indices%5Bdev_blog_index%5D%5Bconfigure%5D%5BhitsPerPage%5D=8&indices%5Bdev_blog_index%5D%5Bpage%5D=1
  // Alternate example without encoding: http://localhost:3000/search?query=canada&page=2&configure[hitsPerPage]=8
  // delete searchStateCopy.indices;
  const searchStateUrl = searchState ? createURL(searchStateCopy) : '';
  return searchStateUrl;
}

const urlToSearchState = ({ search}: { search: any}) => {
  const searchState = qs.parse(search.slice(1));
  // ?q=<term> should set the same search state as ?query=<term>
  if(searchState.q && !searchState.query) {
    searchState.query = searchState.q;
    delete searchState.q;
  }
  return searchState;
};


interface SearchAlgoliaProps extends RouteComponentProps {
  className: string,
  renderSeo: boolean,
  location: any,
  initialSearch?: string,
  showScholarshipsOnly?: boolean,
  onResultsLoaded?: (results: Array<{ items: any, num_items: number }>) => void,
  onSearchQueryChanged?: (searchQuery: any) => void,
}

function SearchAlgolia({ className = "p-md-5",
                         renderSeo = true,
                         location,
                         initialSearch = "",
                         showScholarshipsOnly = false,
                         onResultsLoaded = () => {},
                         onSearchQueryChanged = () => {},
                       }: SearchAlgoliaProps) {

  const [searchState, setSearchState] = useState(urlToSearchState(location));
  const [showExpiredScholarships, setshowExpiredScholarships] = useState(false);
  const [results, setResults] = useState([{'hits': []}]);
  const { push } = useHistory();
  const [searchQuery, setSearchQuery] = useState("");

  const showExpiredScholarshipsOptions = [
    { label: 'Show Expired Scholarships', value: true },
    { label: 'Hide Expired Scholarships', value: false },
  ];

  const debouncedSetStateRef = useRef<null|any>(null);

  const handleSearchStateChange = useCallback((query: any) => {
    clearTimeout(debouncedSetStateRef.current);
    console.log("[grace] search suggestion selected");
    const updatedSearchState = Object.assign({}, searchState, { query: query });
    setSearchQuery(query);
    setSearchState(updatedSearchState);

    debouncedSetStateRef.current = setTimeout(() => {
      console.log("[grace] debounce");
      push(searchStateToUrl(updatedSearchState));
      window.scrollTo(0,0)
    }, DEBOUNCE_TIME);
  }, [searchState, push]);

  /**
   * If a search string was passed in as a prop, update the search state
   */
  useEffect(() => {
    if (initialSearch) {
      handleSearchStateChange(initialSearch)
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
  const blogIndex = Environment.ALGOLIA_BLOG_INDEX;
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

  const onSearchQuerySelected = (event: SyntheticEvent, { suggestion }: any) => {
    event.persist();
    event.preventDefault();
    handleSearchStateChange(suggestion.query);
  };

  useEffect(() => {
    console.log("[grace] user effect");
    onSearchQueryChanged(searchState);
  }, [searchState, onSearchQueryChanged, push]);

  const noScholarhipsShown = results[0].hits.length === 0 || searchState.query?.length === 0

  let searchClient = createSearchClient(handleSearchResultsChange)
  return (
    <div className={`Search container ${className}`}>
    {renderSeo && <HelmetSeo content={seoContent} />}
      <InstantSearch searchClient={algoliaClient}
                     indexName={algoliaQuerySuggestionIndexName}>
        <AutoComplete
                    placeholder={"Search by school, city, program, ethnicity or more"}
                    onSuggestionSelected={onSearchQuerySelected}
                    value={searchQuery}
                    keyName={'searchString'}
                    algoliaPowered={true}/>
      </InstantSearch>
      <InstantSearch searchClient={searchClient}
                     indexName={scholarshipIndex}
                     searchState={searchState}
                     onSearchStateChange={() => {}}
                     createURL={createURL}>
          <Configure clickAnalytics />
          <VirtualSearchBox defaultRefinement={searchQuery} />
          <PoweredBy  className="mb-3" />
          <Index indexName={scholarshipIndex}>
            <Configure hitsPerPage={HITS_PER_PAGE} {...scholarshipConfiguration} />
            {!noScholarhipsShown &&
            <>
              <Radio.Group
                  className="mb-3"
                  options={showExpiredScholarshipsOptions}
                  onChange={event => setshowExpiredScholarships(event.target.value)}
                  value={showExpiredScholarships}
                  optionType="button"
                  buttonStyle="solid"
              />
              <SearchResults title="Scholarships">
                <Hits hitComponent={SearchResultHitsWithInsights} />
              </SearchResults>
              <Pagination  className="my-3" />
            </>}
          </Index>

        {!showScholarshipsOnly &&
        <Index indexName={blogIndex}>
          <Configure hitsPerPage={HITS_PER_PAGE}/>
          <SearchResults title="Blogs">
            <Hits hitComponent={SearchResultHitsWithInsights}/>
          </SearchResults>
          <Pagination className="my-3"/>
        </Index>
        }

      </InstantSearch>
    </div>
  )
}

export default withRouter(SearchAlgolia);