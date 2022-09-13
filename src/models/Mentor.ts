import { Demographic } from "./Demographic";
import { UserProfile } from "./UserProfile.class";

export interface Mentor extends Demographic {
    [key: string]: string | UserProfile| Array<string>;
    id: string,
    user: UserProfile,
    bio: string,
    mentorship_topics: string,
    price: string, // string because it's a decimal number
};


