import React, {  } from 'react';
import { connectStateResults } from 'react-instantsearch-dom';
import 'instantsearch.css/themes/satellite.css'; //algolia instant search styling
import ScholarshipCard from '../Scholarship/ScholarshipCard';
import Loading from '../../components/Loading';


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
  /**
   * Only show results when 3 or more characters are typed and let user know if no results were found.
   * https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-display/react/
   */
  export const Results = connectStateResults(
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