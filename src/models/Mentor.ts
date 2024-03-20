import { Demographic } from "./Demographic";
import { UserProfile } from "./UserProfile.class";

export interface Mentor extends Demographic {
    [key: string]: string | UserProfile| Array<string> | Duration[];
    bio_recording_url: string,
    id: string,
    user: UserProfile,
    description: string,
    bio: string,
    mentorship_topics: string,
    schedule_url: string,
    price: string, // string because it's a decimal number
    prices: Duration[], //TODO rename this to durations
};


export interface Duration {
    price: number,
    schedule_url: string,
    minutes: number,
}
