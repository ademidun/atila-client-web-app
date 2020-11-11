import PropTypes from "prop-types";
import {UserProfileTest1} from "./UserProfile";
import {Link} from "react-router-dom";
import React from "react";
import {Alert, Popover} from "antd";

let nextMonth = new Date();
nextMonth.setDate(nextMonth.getDate() + 30);
nextMonth = nextMonth.toISOString();

let defaultDeadline = new Date();
let defaultTime = "T23:59:00";
defaultDeadline.setDate(defaultDeadline.getDate() + 61);
defaultDeadline = defaultDeadline.toISOString();
defaultDeadline = defaultDeadline.split('T')[0] + defaultTime;


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
export const scholarshipUserProfileQuestionOptions = [
    "first_name",
    "last_name",
    "email",
    "post_secondary_school",
    "major",
    "eligible_programs",
    "eligible_major",
    "ethnicity",
    "country",
    "citizenship",
    "extracurricular_description",
    "academic_career_goals",
];

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
    "checkbox": "checkbox",
};

export let DEFAULT_SCHOLARSHIP = {
    name: '',
    slug: '',
    description: '',
    img_url: '',
    scholarship_url: '',
    specific_questions: [],
    user_profile_questions: scholarshipUserProfileQuestionOptions.slice(0,3).map(question => ({key: question})),
    form_url: '',
    deadline: defaultDeadline,
    open_date: '2022-12-31',
    funding_amount: '',
    stripe_payment_intent_id: '',
    number_available_scholarships: 1,
    female_only: false,
    international_students_eligible: false,
    id: null,
    metadata: {},
    eligible_schools: [],
    is_atila_direct_application: false,
    is_editable: true,
    published: false,
    is_funded: false,
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

const atilaDirectApplicationsPopoverContent = (
    <div>
        These types of scholarships allows sponsors to start and fund scholarships

        and allow students to apply and get paid for scholarships all through the Atila platform:
        <ul>
            <li>
                Funds deposited to student's bank account within 24 hours
            </li>
            <li>
                Scholarships are promoted to Atila's network of students and student organizations.
            </li>
            <li>
                Automatically notify winners and non-winners.
            </li>
            <li>
                Simple interface for managing all your applications.
            </li>
        </ul>
        <Link to="/start">Learn More</Link>
    </div>
);

export const AtilaDirectApplicationsPopover = ({children, title="What is Atila Direct Applications?"}) => (
    <Popover overlayStyle={{maxWidth: "500px"}} content={atilaDirectApplicationsPopoverContent} title={title}>
        {children}
    </Popover>

);

export const ScholarshipDisableEditMessage = () => (
    <Alert
        type="info"
        message={"Once scholarship is funded and published: deadline, fuding amount, eligibility, and specific questions cannot be changed directly. " +
        "\nIf you want to change any of those fields, please contact us (you can use the chat box in the bottom right)."}
    />
);

export const ScholarshipFundingWillPublishMessage = () => (
    <Alert
        type="success"
        message={"Funding your scholarship will publish it and make it live!"}
    />
);