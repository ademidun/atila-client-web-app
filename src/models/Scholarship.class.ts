import { UserProfile } from "./UserProfile.class";

export class Scholarship {
    id: string = "";
    name: string = "";
    description: string = "";
    scholarship_url: string = "";
    deadline: string = "";
    is_atila_direct_application: boolean = false;
    is_crypto: boolean = false;
    owner_detail: UserProfile = new UserProfile();
}