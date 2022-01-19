import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import 'instantsearch.css/themes/satellite.css'; //algolia instant search styling

const searchClient = algoliasearch('HH66ESLTOR', '0bd3e798b8330dc08ba51ab519fd35e7');

function SearchAlgolia() {
  return (
    <div className="SearchAlgolia container p-5">    
    <InstantSearch searchClient={searchClient} indexName="dev_scholarship_index">
      <SearchBox className="mb-5" />
      <Hits />
    </InstantSearch>
    </div>
  )
}

export default SearchAlgolia
