import { UserProfile } from "./UserProfile.class";

export interface Mentor {
    user: UserProfile,
    bio: string,
    mentorship_topics: string,
    price: string, // string because it's a decimal number
};


export const mentorProfileFormConfig = [
    {
        keyName: 'bio',
    },
];