import React from 'react';
import ScholarshipCard from '../scenes/Scholarship/ScholarshipCard';

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
    "scholarship": {
        "activities": "[]",
        "archived": false,
        "citizenship": "[]",
        "city": "[]",
        "country": "[]",
        "criteria_info": "<h2>About Scholarship</h2><div><p>The Jeremy Dias Scholarship seeks to recognize a youth that has taken initiative in addressing discrimination in their school or community.</p><p>Applicants must be Canadian citizens/residents; and must be a high school or Cegep students entering accredited post-secondary institutions, or students currently enrolled in a post-secondary institution.</p><p>The ideal winner(s) of this scholarship will be student(s) who have worked to eliminate discrimination within...",
        "date_created": "2021-01-31",
        "date_time_created": "2021-01-31T00:13:44.031527Z",
        "deadline": "2021-08-30T03:59:00Z",
        "description": "This scholarship is open to any student.",
        "disability": "[]",
        "eligible_programs": "[]",
        "eligible_schools": "[]",
        "ethnicity": "[]",
        "female_only": false,
        "international_students_eligible": false,
        "form_url": "",
        "funding_amount": "1000.00",
        "heritage": "[]",
        "id": 772,
        "industries": "[]",
        "img_url": "https://ucarecdn.com/f7b3a151-c647-479d-8d80-0206151a292b/",
        "is_atila_direct_application": false,
        "is_funded": false,
        "is_editable": true,
        "is_not_available": false,
        "is_payment_accepted": false,
        "is_winner_selected": false,
        "keywords": "",
        "language": "[]",
        "learn_more_url": null,
        "learn_more_title": null,
        "metadata": "{base_score: 0}",
        "name": "Jeremy Dias Scholarship",
        "is_finalists_notified": false,
        "finalists_notified_date": null,
        "number_available_scholarships": 1,
        "occupations": "[]",
        "open_date": "2021-04-01",
        "other_demographic": "[]",
        "owner": 2231,
        "owner_detail": "{first_name: \"Atila\", last_name: \"Scholarships\", pr…}",
        "province": "[]",
        "published": true,
        "religion": "[]",
        "scholarship_url": "https://ccgsd-ccdgs.org/scholarships/",
        "slug": "jeremy-dias-scholarship-33hceu8y",
        "specific_questions": "[]",
        "sports": "[]",
        "updated_at": "2021-08-25T22:31:37.139718Z",
        "user_profile_questions": "[]",
        "is_blind_applications": false,
        "is_referral_bonus_eligible": false,
        "collaborators": "[]",
        "reddit_url": null
    },
    "viewAsUserProfile": null,
    "matchScoreBreakdown": null,
    "isOneColumn": null
};
