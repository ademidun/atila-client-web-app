import React from 'react';
import ScholarshipCard from '../scenes/Scholarship/ScholarshipCard';
import JeremyDiasScholarship from '../services/mocks/Scholarship/JeremyDiasScholarship.json'
//👇 This default export determines where your story goes in the story list
export default {
    title: 'ScholarshipCard',
    component: ScholarshipCard
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <ScholarshipCard {...args} />;

export const Scholarship = Template.bind({});

Scholarship.args = {
    "className": "col-12",
    "scholarship": JeremyDiasScholarship,
    "viewAsUserProfile": null,
    "matchScoreBreakdown": null,
    "isOneColumn": null
};
