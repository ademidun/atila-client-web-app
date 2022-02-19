import { DEFAULT_CRYPTO_AWARD } from "./Award";
import { CAD, ETH } from "./ConstantsPayments";

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

export const DEFAULT_CRYPTO_CONTRIBUTION: Contributor = {
    ...new Contributor(),
    currency: ETH.code,
    funding_amount: DEFAULT_CRYPTO_AWARD.funding_amount as number,
}