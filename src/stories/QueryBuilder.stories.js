import React from 'react';
import QueryBuilder from '../components/Query/QueryBuilder';

export default {
  title: 'QueryBuilder',
  component: QueryBuilder,
};

const Template = (args) => <QueryBuilder {...args} />;

export const ContactQueryBuilder = Template.bind({});

ContactQueryBuilder.args = {
    onUpdateQuery: (query)=>{},
    updateQueryPropsOnLoad: false,
    sampleSearches: DEFAULT_SAMPLE_SEARCHES
};