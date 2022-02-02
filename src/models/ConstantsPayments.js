class Currency {
    constructor(name,
                code,
                minimum_funding_amount_contribute_new_award,
                minimum_funding_amount_contribute_scholarship,
                is_crypto=false) {
        this.name = name
        this.code = code
        this.minimum_funding_amount_contribute_new_award = minimum_funding_amount_contribute_new_award
        this.minimum_funding_amount_contribute_scholarship = minimum_funding_amount_contribute_scholarship
        this.is_crypto = is_crypto
    }
}

export const CAD = new Currency(
    "Canadian Dollar",
    "CAD",
    200,
    10
)

export const USD = new Currency(
    "United States Dollar",
    "USD",
    200,
    10
)

export const ETH = new Currency(
    "Ethereum",
    "ETH",
    0.07,
    0.02,
    true
)

export const BNB = new Currency(
    "Binance Coin",
    "BNB",
    0.5,
    0.09,
    true
)

export const Currencies = {
    "CAD": CAD, "USD": USD, "ETH": ETH, "BNB": BNB
}
Object.freeze(Currencies)

export const CURRENCY_CODES = Object.keys(Currencies).map(key => Currencies[key].code)

export const ATILA_SCHOLARSHIP_FEE = 0.09;
export const ATILA_SCHOLARSHIP_FEE_TAX = 0.13;