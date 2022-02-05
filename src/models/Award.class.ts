import { CAD } from "./ConstantsPayments";

export class Award {
    funding_amount: number | string = 0;
    currency: string = "";
}

export const DEFAULT_AWARD: Award = {
    funding_amount: 1000,
    currency: CAD.code,
}