export const ScholarshipGeneral = {
    id: 200,
    name: 'General Scholarship',
    description: 'Anyone can secure the bag.',
    amount: '200',
    slug: 'general-scholarship'
};

export const ScholarshipEngineering = {
    id: 100,
    name: 'Engineering Scholarship',
    description: 'Scholarship only for awesome engineering students',
    amount: '100',
    slug: 'engineering-scholarship'
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
    form_url: '',
    deadline: '2022-12-31T23:59:00',
    funding_amount: '',
    funding_type: ['Scholarship'],
    female_only: false,
    international_students_eligible: false,
    id: null,
    metadata: {},
    no_essay_required: false,
    eligible_schools: [],
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