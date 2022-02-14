import { CAD } from "./ConstantsPayments";

export class Contributor {
    is_anonymous: boolean = false;;
    first_name: string = "";
    last_name: string = "";
    email: string = "";
    user?: number;
    currency: string = CAD.code;
    wallet_address?: string;
    chain_id?: number;
    transaction_hash?: string;
}
