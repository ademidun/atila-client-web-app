import { getRandomNumber } from "../services/utils";
import { UserProfile } from "./UserProfile.class";

export class Scholarship {
    id: number = 0;
    name: string = "";
    description: string = "";
    scholarship_url: string = "";
    img_url: string = "";
    date_created: string = "";
    slug: string = "";
    funding_amount: string | number = 0;
    deadline: string = "";
    open_date?: string;
    is_atila_direct_application: boolean = false;
    is_funded: boolean = true;
    is_crypto: boolean = false;
    is_winner_selected: boolean = false;
    is_direct_application: boolean = false;
    is_blind_applications: boolean = false;
    owner_detail: UserProfile = new UserProfile();
    metadata: {
        not_open_yet?: boolean
    } = {};
    city?: Array<Location>;
    province?: Array<Location>;
    country?: Array<Location>;
    specific_questions: ScholarshipQuestion[] = [];
}

export interface ScholarshipQuestion {
    key: string,
    question: string,
    type: QuestionType
}

declare const QuestionTypes: ["short_answer", "medium_answer", "long_answer", "checkbox", "file", "multi_select", "single_select"];
export declare type QuestionType = typeof QuestionTypes[number];

export class Location {
    city?: string;
    province?: string;
    country?: string;
    name?: string;
}

export const DEFAULT_CRYPTO_SCHOLARSHIP = {
    ...new Scholarship(),
    name: 'Crypto Scholarship',
    slug: 'crypto-scholarship',
    id: getRandomNumber(),
    funding_amount: 1000,
    // although this is a crypto scholarship, currency is USD, because all crypto scholarships are converted to a common currency of USD for consistency
    currency: 'USD',
    is_atila_direct_application: true,
    is_crypto: true,
}
