import { UserProfile } from "./UserProfile.class";

export interface Wallet {
    id: string;
    user: number;
    user_detail?: UserProfile;
    label: string;
    address: string;
}