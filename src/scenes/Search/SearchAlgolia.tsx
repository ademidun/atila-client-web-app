import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

const searchClient = algoliasearch('HH66ESLTOR', '0bd3e798b8330dc08ba51ab519fd35e7');

const App = () => (
  <InstantSearch searchClient={searchClient} indexName="dev_scholarship_index">
    <SearchBox />
    <Hits />
  </InstantSearch>
);
