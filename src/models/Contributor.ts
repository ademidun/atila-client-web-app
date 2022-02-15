import { CAD } from "./ConstantsPayments";

export class Contributor {
    is_anonymous: boolean = false;
    is_owner: boolean = false;
    first_name: string = "";
    last_name: string = "";
    email: string = "";
    user?: number;
    username: any;
    profile_pic_url?: string;
    funding_amount: number = 0;
    currency: string = CAD.code;
    wallet_address?: string;
    chain_id?: number;
    transaction_hash?: string;
}
