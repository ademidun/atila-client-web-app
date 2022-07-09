import { UserProfile } from "./UserProfile.class";

export class Application {
    id: string | null = "";
    user: number | UserProfile = 0;
    scholarship: number = 0;
    is_submitted?: boolean = false;
    wallet?: string = "";
    wallet_address?: string = "";
}