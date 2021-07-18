import { ScholarshipGeneral, ScholarshipEngineering, ScholarshipMilton } from "./Scholarship";
import { UserProfileTest1 } from "./UserProfile";

export const ApplicationGeneral = {
    id: 'abcde12345',
    scholarship: ScholarshipGeneral,
    user: UserProfileTest1,
}

export const ApplicationEngineering = {
    id: 'agfasdg345',
    scholarship: ScholarshipEngineering,
    user: UserProfileTest1,
}

export const ApplicationMilton = {
    id: '4hr89fh39ebc9',
    scholarship: ScholarshipMilton,
    user: UserProfileTest1,
}

export const ApplicationsListMockData = [
    ApplicationGeneral,
    ApplicationEngineering,
    ApplicationMilton
]

