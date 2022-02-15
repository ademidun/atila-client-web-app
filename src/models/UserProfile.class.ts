export class UserProfile {
    user: number = 0;
    first_name: string = "";
    last_name: string = "";
    is_atila_admin: boolean = false;
    funding_amount: number = 0;
    username: any;
    profile_pic_url: string | undefined;
    is_winner: boolean | null = null;
    is_owner: boolean = false;
    is_anonymous: boolean = false;
}