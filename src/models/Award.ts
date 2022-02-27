import { Application } from "./Application.class";
import { CAD, ETH } from "./ConstantsPayments";

export class Award {
    id?: string = "";
    funding_amount: number | string = 0;
    currency: string = "";
    recipient?: Application;
}

export const DEFAULT_AWARD: Award = {
    funding_amount: 1000,
    currency: CAD.code,
}

export const DEFAULT_CRYPTO_AWARD: Award = {
    funding_amount: 0.15,
    currency: ETH.code,
}