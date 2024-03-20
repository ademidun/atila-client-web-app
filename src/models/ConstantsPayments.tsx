import React, {  } from 'react';

/**
 * Atila's wallet address on all EVM chains
 * see: https://etherscan.io/address/0x38103603feb199fba32be9b3a464877f28e659a7
 * atilatech.eth
 */
export const ATILA_EVM_WALLET_ADDRESS = "0x38103603feb199fba32be9b3a464877f28e659a7";

class Currency {

name: string = "";
code: string = "";
minimum_funding_amount_contribute_new_award: number = 0;
minimum_funding_amount_contribute_scholarship: number = 0;
is_crypto?: boolean = false;

}

export const CAD: Currency = {

    name: "Canadian Dollar",
    code: "CAD",
    minimum_funding_amount_contribute_new_award: 200,
    minimum_funding_amount_contribute_scholarship: 10
}


export const USD: Currency = {

    name: "United States Dollar",
    code: "USD",
    minimum_funding_amount_contribute_new_award: 200,
    minimum_funding_amount_contribute_scholarship: 10
}


export const ETH: Currency = {

    name: "Ethereum",
    code: "ETH",
    minimum_funding_amount_contribute_new_award: 0.07,
    minimum_funding_amount_contribute_scholarship: 0.01,
    is_crypto: true,
}

export const BNB: Currency = {

    name: "Binance Coin",
    code: "BNB",
    minimum_funding_amount_contribute_new_award: 0.5,
    minimum_funding_amount_contribute_scholarship: 0.09,
    is_crypto: true,
}

export const BINANCE_SMART_CHAIN_MAINNET_CHAIN_ID = 56;
export const BINANCE_SMART_CHAIN_TESTNET_CHAIN_ID = 97;

export const Currencies: {[key: string]: Currency} = {
    "CAD": CAD, "USD": USD, "ETH": ETH, "BNB": BNB
}
Object.freeze(Currencies)

export const CURRENCY_CODES = Object.values(Currencies).map(currency => currency.code)

export const ATILA_SCHOLARSHIP_FEE = 0.09;
export const ATILA_MENTORSHIP_FEE = 0.10;
export const ATILA_SCHOLARSHIP_FEE_TAX = 0.13;

export const CryptoCurrencies = Object.values(Currencies).filter(currency => currency.is_crypto).map(currency => currency.code);

export const cryptoWalletTutorialUrl = "https://atila.ca/blog/aarondoerfler/how-to-setup-metamask-and-connect-it-to-atila";

export const ConnectWalletHelperText = () => (
    <>
    <strong>First time connecting a wallet?</strong>
    <ol>
        <li><a href="https://metamask.io" target="_blank" rel="noopener noreferrer">Install the Metamask crypto wallet</a></li>
        <li>See <a href={cryptoWalletTutorialUrl} target="_blank" rel="noopener noreferrer"> How to connect a crypto wallet to your Atila account</a></li>
    </ol>
    </>
)

export const CryptoScholarshipWalletExplanation = () => (
    <>
        This scholarship is paid in crypto so you need a 
       {' '}<a href={cryptoWalletTutorialUrl} target="_blank" rel="noopener noreferrer">crypto wallet</a>{' '}to apply. <br/>
        This wallet address will be submitted with your application and used to send you an award if chosen.
    </>
)