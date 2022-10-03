import { Mentor } from "./Mentor";
import { UserProfile } from "./UserProfile.class";

export interface MentorshipSession {
    id?: string,
    mentor?: Mentor,
    mentee?: UserProfile,
    stripe_payment_intent_id?: string, // mentee can either be the Mentor object or the mentor ID
    notes: string, // mentee can either be the Mentor object or the mentor ID,
    event_scheduled?: true,
    event_details?: Object,
}