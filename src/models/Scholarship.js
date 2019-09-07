export const ScholarshipGeneral = {
    id: 0,
    name: 'General Scholarship',
    description: 'Anyone can secure the bag.',
    amount: '200'
};

export const ScholarshipEngineering = {
    id: 1,
    name: 'Engineering Scholarship',
    description: 'Scholarship only for awesome engineering students',
    amount: '100'
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