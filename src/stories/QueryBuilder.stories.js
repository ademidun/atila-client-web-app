import React from 'react';
import QueryBuilder, { DEFAULT_SAMPLE_SEARCHES } from '../components/Query/QueryBuilder';

export default {
  title: 'QueryBuilder',
  component: QueryBuilder,
  argTypes: { onUpdateQuery: { action: ()=> {} } },
  args: {
    updateQueryPropsOnLoad: false,
    primary: DEFAULT_SAMPLE_SEARCHES,
  },
};

const Template = (args) => <QueryBuilder {...args} />;

export const ContactQueryBuilder = Template.bind({});