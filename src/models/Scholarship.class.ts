import { getRandomNumber } from "../services/utils";
import { UserProfile } from "./UserProfile.class";

export class Scholarship {
    id: number = 0;
    name: string = "";
    description: string = "";
    scholarship_url: string = "";
    slug: string = "";
    funding_amount: string | number = 0;
    deadline: string = "";
    is_atila_direct_application: boolean = false;
    is_crypto: boolean = false;
    owner_detail: UserProfile = new UserProfile();
    metadata: {
        not_open_yet?: boolean
    } = {};
}

export const ScholarshipDirectApplicationCrypto = {
    ...new Scholarship(),
    name: 'Crypto Direct Application Scholarship',
    slug: 'crypto-direct-app-scholarship',
    id: getRandomNumber(),
    funding_amount: 1000,
    // although this is a crypto scholarship, currency is USD, because all crypto scholarships are converted to a common currency of USD for consistency
    currency: 'USD',
    is_atila_direct_application: true,
    is_crypto: true,
}
