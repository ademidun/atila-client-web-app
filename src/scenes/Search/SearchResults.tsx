import React, {  } from 'react';
import { connectStateResults } from 'react-instantsearch-dom';
import 'instantsearch.css/themes/satellite.css'; //algolia instant search styling
import ScholarshipCard from '../Scholarship/ScholarshipCard';
import Loading from '../../components/Loading';
import { genericItemTransform, getItemType } from '../../services/utils';
import ContentCard from '../../components/ContentCard';


export function SearchResultHit(props: any) {

    const { hit } = props;
    const itemType = getItemType(hit);

    if (hit.deadline && Number.isInteger(hit.deadline)) {
      if (new Date(hit.deadline).toISOString().startsWith("1970")) {
        // if the timestamp is giving an epoch date then it's probably in seconds and we should multiply by 1000 to convert to milliseconds
        hit.deadline = hit.deadline * 1000
      }
      hit.deadline = new Date(hit.deadline).toISOString();
  }
    return (
        <>
            {itemType === "scholarship" ? 
            <ScholarshipCard scholarship={hit} className="col-12" /> :
            <ContentCard content={genericItemTransform(hit)} />}
        </>
      
    );
  }

  interface SearchResultsProps { 
    searchState: any,
    searchResults: any,
    children: any,
    isSearchStalled: boolean,
    title?: string,
}
  /**
   * Only show results when 3 or more characters are typed and let user know if no results were found.
   * https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-display/react/
   */

  export const SearchResults = connectStateResults((props: SearchResultsProps) => {
    const { searchState, searchResults, children, isSearchStalled, title } = props;
      const showExpiredScholarshipsPrompt = searchResults?._state?.filters?.startsWith("deadline >=") && 
      searchResults?._state?.index?.includes("scholarship_index") ? "Try showing expired scholarships to see more results." : "";

      let results = children;
      if (!searchState?.query || searchState?.query?.length < 3) {
        results = <p>Please type at least 3 characters</p>
      } else if (searchResults?.nbHits === 0) {
        results = <p>No results found for {searchState.query}.
        {showExpiredScholarshipsPrompt}</p>
      }

      return <div className="SearchResults">
        {title && <h2 className="text-center">{title}</h2>}
        {isSearchStalled && <Loading title="Loading search results" />}
        {results}
      </div>
    }
  );