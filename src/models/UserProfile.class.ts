import { getRandomString } from "../services/utils";

export class UserProfile {
    user: number = 0;
    first_name: string = "";
    last_name: string = "";
    email: string = "";
    password: string = "";
    is_atila_admin: boolean = false;
    funding_amount: number = 0;
    username: any;
    profile_pic_url: string | undefined;
    is_winner: boolean | null = null;
    is_owner: boolean = false;
    is_anonymous: boolean = false;
}

export const autoGenerateUser = () => {
    const randomSuffix = getRandomString();
    return {
        first_name: `FirstName_${randomSuffix}`,
        last_name: `LastName_${randomSuffix}`,
        username: `auto_user_${randomSuffix}`,
        email: `auto_user+${randomSuffix}@atila.ca`,
        password: getRandomString(),
    }
}