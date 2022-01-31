class Currency {
    constructor(name, minimum_funding_amount_contribute_new_award, minimum_funding_amount_contribute_scholarship) {
        this.name = name
        this.minimum_funding_amount_contribute_new_award = minimum_funding_amount_contribute_new_award
        this.minimum_funding_amount_contribute_scholarship = minimum_funding_amount_contribute_scholarship
    }
}

const CAD = new Currency(
    "CAD", 200, 10
)

const USD = new Currency(
    "USD", 200, 10
)

export const Currencies = {
    "CAD": CAD, "USD": USD
}
Object.freeze(Currencies)


export const ATILA_SCHOLARSHIP_FEE = 0.09;
export const ATILA_SCHOLARSHIP_FEE_TAX = 0.13;