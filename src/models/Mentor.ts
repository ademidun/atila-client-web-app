import { Demographic } from "./Demographic";
import { UserProfile } from "./UserProfile.class";

export interface Mentor extends Demographic {
    [key: string]: string | UserProfile| Array<string>;
    id: string,
    user: UserProfile,
    description: string,
    bio: string,
    mentorship_topics: string,
    schedule_url: string,
    price: string, // string because it's a decimal number
};


