import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, PoweredBy, Pagination } from 'react-instantsearch-dom';
import 'instantsearch.css/themes/satellite.css'; //algolia instant search styling
import ScholarshipCard from '../Scholarship/ScholarshipCard';
import Environment from '../../services/Environment';

const searchClient = algoliasearch(Environment.ALGOLIA_APP_ID, Environment.ALGOLIA_PUBLIC_KEY);

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


function SearchAlgolia() {
  return (
    <div className="SearchAlgolia container p-5">    
    <InstantSearch searchClient={searchClient} indexName="dev_scholarship_index">
        <SearchBox />
        <Hits hitComponent={SearchResultHit} />
        <Pagination />
        <PoweredBy />
    </InstantSearch>
    </div>
  )
}

export default SearchAlgolia
