import { UserProfile } from "./UserProfile.class";

export class Scholarship {
    id: number = 0;
    name: string = "";
    description: string = "";
    scholarship_url: string = "";
    funding_amount: string | number = 0;
    deadline: string = "";
    is_atila_direct_application: boolean = false;
    is_crypto: boolean = false;
    owner_detail: UserProfile = new UserProfile();
    metadata: {
        not_open_yet?: boolean
    } = {};
}