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
    is_winner_selected: false,
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

// TODO Crop Images and give attribution on Terms and Conditions page;
// Note that the unsplash query parameter URLS are all cropped such that they are perfectly square
let contributor_profile_pic_1 = "https://firebasestorage.googleapis.com/v0/b/atila-7.appspot.com/o/user-profiles%2Fgeneral-data%2Fdefault-profile-pic.png?alt=media&token=455c59f7-3a05-43f1-a79e-89abff1eae57";

// https://unsplash.com/photos/jBUCxayAzm0
// let contributor_profile_pic_2 = "https://images.unsplash.com/photo-1586326448571-8c6e1e473bad?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTF8fHxlbnwwfHx8&auto=format&fit=crop&w=400&h=400";

// https://unsplash.com/photos/G8cB8hY3yvU
let contributor_profile_pic_3 = "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=400&h=400";

// https://unsplash.com/photos/2s6ORaJY6gI
let contributor_profile_pic_4 = "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400";

// https://unsplash.com/photos/G8cB8hY3yvU
// let contributor_profile_pic_5 = "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=400&h=400";
//
// // https://unsplash.com/photos/sVtcRzphxbk
// let contributor_profile_pic_6 = "https://images.unsplash.com/photo-1593134257782-e89567b7718a?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NHx8cHVwcHl8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400";
//
// // cat blue background
// // https://unsplash.com/photos/G8cB8hY3yvU
// let contributor_profile_pic_7 = "https://images.unsplash.com/photo-1574158622682-e40e69881006?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400";
//
// // cat blue eyes
// // https://unsplash.com/photos/IFxjDdqK_0U
// let contributor_profile_pic_8 = "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=400&h=400";
//
// // grey cat licking paws
// // https://unsplash.com/photos/Hd7vwFzZpH0
// let contributor_profile_pic_9 = "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400";

// light brown cat with light green eyes
// https://unsplash.com/photos/uhnbTZC7N9k
let contributor_profile_pic_10 = "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&h=400&w=400";


export let SCHOLARSHIP_CONTRIBUTOR_PROFILE_PICTURES = [
    contributor_profile_pic_1,
    // contributor_profile_pic_2,
    contributor_profile_pic_3,
    contributor_profile_pic_4,
    // contributor_profile_pic_5,
    // contributor_profile_pic_6,
    // contributor_profile_pic_7,
    // contributor_profile_pic_8,
    // contributor_profile_pic_9,
    contributor_profile_pic_10,
];

export function getRandomContributorProfilePicture(excludeDefaultProfilePicture=true) {

    // exclude the first element which is default profile picture profile picture;
    let animalPictures = SCHOLARSHIP_CONTRIBUTOR_PROFILE_PICTURES;
    if (excludeDefaultProfilePicture) {
        animalPictures = animalPictures.slice(1);
    }
    return animalPictures[Math.floor(Math.random() * animalPictures.length)];
}

export let DEFAULT_SCHOLARSHIP_CONTRIBUTOR = {
    first_name: "",
    last_name: "",
    funding_amount: "",
    email: "",
    user: null,
    is_anonymous:false,
    username: null,
    profile_pic_url: getRandomContributorProfilePicture(),
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

export const WINNER_SELECTED_MESSAGE = "Winner successfully selected.\n\n" +
    " You should receive a thank you letter from the winner in the next 7 days.\n\n" +
    "Atila will send the money to the winner once they've verified their account, provided proof of enrollment and written a thank you letter.";

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