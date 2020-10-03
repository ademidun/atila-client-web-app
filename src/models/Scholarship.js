import PropTypes from "prop-types";
import {UserProfileTest1} from "./UserProfile";

let nextMonth = new Date();
nextMonth.setDate(nextMonth.getDate() + 30);
nextMonth = nextMonth.toISOString();

export const MILTON_LOCATION_OBJECT = {
    name: 'Milton',
    province: 'Ontario',
    country: 'Canada',
    id: 1,
};

export const ScholarshipGeneral = {
    id: 200,
    name: 'General Scholarship',
    description: 'Anyone can secure the bag.',
    amount: '200',
    slug: 'general-scholarship',
    deadline: nextMonth,
};

export const ScholarshipEngineering = {
    id: 100,
    owner: UserProfileTest1.user,
    name: 'Engineering Scholarship',
    description: 'Scholarship only for awesome engineering students',
    amount: '100',
    slug: 'engineering-scholarship',
    eligible_programs: ['Engineering'],
    deadline: nextMonth,
};

export const ScholarshipMilton = {
    id: 100,
    name: 'Engineering Scholarship',
    description: 'Scholarship only for awesome engineering students',
    amount: '100',
    slug: 'engineering-scholarship',
    city: [MILTON_LOCATION_OBJECT],
    deadline: nextMonth,
};

export const scholarshipsListMockData = [
    ScholarshipGeneral,
    ScholarshipEngineering
];
export const scholarshipsListResponseMockData = {
    data: {
        data: scholarshipsListMockData,
        funding: '$300',
        length: 2
    }
};
export let defaultScholarship = {
    name: '',
    slug: '',
    description: '',
    img_url: '',
    scholarship_url: '',
    specific_questions: [],
    user_profile_questions: [],
    form_url: '',
    deadline: '2022-12-31T23:59:00',
    open_date: '2022-12-31',
    funding_amount: '',
    funding_type: ['Scholarship'],
    female_only: false,
    international_students_eligible: false,
    id: null,
    metadata: {},
    no_essay_required: false,
    eligible_schools: [],
    is_atila_direct_application: false,
    eligible_programs: [],
    email_contact: '',
    activities: [],
    ethnicity: [],
    heritage: [],
    citizenship: [],
    religion: [],
    sports: [],
    disability: [],
    language: [],
};

export const ScholarshipPropType = PropTypes.shape({
    name: PropTypes.string.isRequired,
    deadline: PropTypes.string,
    is_not_available: PropTypes.boolean,
    female_only: PropTypes.boolean,
    international_students_eligible: PropTypes.boolean,
    form_url: PropTypes.string,
});


export const SCHOLARSHIP_QUESTIONS_TYPES_TO_FORM_TYPES = {
    "short_answer": "text",
    "medium_answer": "textarea",
    "long_answer": "html_editor",
};