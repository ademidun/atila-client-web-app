import { CAD, ETH } from "./ConstantsPayments";
import { Wallet } from "./Wallet.class";

export class Award {
    id?: string = "";
    funding_amount: number | string = 0;
    currency: string = "";
    recipient_wallet?: Wallet;
}

export const DEFAULT_AWARD: Award = {
    funding_amount: 1000,
    currency: CAD.code,
}

export const DEFAULT_CRYPTO_AWARD: Award = {
    funding_amount: 0.15,
    currency: ETH.code,
}