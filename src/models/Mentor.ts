import { Demographic } from "./Demographic";
import { UserProfile } from "./UserProfile.class";

export interface Mentor extends Demographic {
    [key: string]: string | UserProfile| Array<string>;
    bio_recording_url: string,
    id: string,
    user: UserProfile,
    bio: string,
    mentorship_topics: string,
    price: string, // string because it's a decimal number
};


