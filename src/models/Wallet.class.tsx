import { UserProfile } from "./UserProfile.class";

export interface Wallet {
    user: number,
    user_detail?: UserProfile,
    address: string,
}