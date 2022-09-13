import { Mentor } from "./Mentor";
import { UserProfile } from "./UserProfile.class";

export interface MentorshipSession {
    id: string,
    mentor: Mentor | string, // mentor can either be the Mentor object or the mentor ID
    mentee: UserProfile | number, // mentor can either be the Mentor object or the mentor ID
}