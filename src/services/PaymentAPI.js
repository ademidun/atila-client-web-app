import Environment from "./Environment";
import request from "axios";

class PaymentAPI {

    static apiUrlPayment = `${Environment.apiUrl}/payment`;
    static apiUrlKeyCredits = `${PaymentAPI.apiUrlPayment}/api-key-credits`;
    static apiUrlTransactions = `${PaymentAPI.apiUrlPayment}/transactions`;
    static apiUrlWallets = `${PaymentAPI.apiUrlPayment}/wallets`;

    static getClientSecret = (paymentData) => {

        const apiCompletionPromise = request({
            url: `${PaymentAPI.apiUrlPayment}/get-client-secret/`,
            method: 'post',
            data: paymentData,
        });

        return apiCompletionPromise;
    };

    static saveTransaction = (postData) => {

        const apiCompletionPromise = request({
            url: `${PaymentAPI.apiUrlTransactions}/`,
            method: 'post',
            data: postData,
        });

        return apiCompletionPromise;
    };

    static createWallet = (postData) => {

        const apiCompletionPromise = request({
            url: `${PaymentAPI.apiUrlWallets}/`,
            method: 'post',
            data: postData,
        });

        return apiCompletionPromise;
    };

    static patchWallet = (id, postData) => {

        const apiCompletionPromise = request({
            url: `${PaymentAPI.apiUrlWallets}/${id}/`,
            method: 'patch',
            data: postData,
        });

        return apiCompletionPromise;
    };

    static getAPIKeyCreditByPublicKey = (publicKey) => {

        const apiCompletionPromise = request({
            url: `${PaymentAPI.apiUrlKeyCredits}/public-key/?public_key=${publicKey}/`,
            method: 'GET',
        });

        return apiCompletionPromise;
    };

    static buyCredits = (publicKey, creditsAmount, transactionId, chainId) => {

        const apiCompletionPromise = request({
            url: `${PaymentAPI.apiUrlKeyCredits}/buy-credits/`,
            method: 'POST',
            data: {
                api_key_credit_public_key: publicKey,
                credits_amount: creditsAmount,
                credits_type: "search",
                transaction_hash: transactionId,
                chain_id: chainId,
            },
        });

        return apiCompletionPromise;
    };

    static sendApiKeyCredit = (data) => {

        const apiCompletionPromise = request({
            method: 'post',
            data,
            url: `${PaymentAPI.apiUrlKeyCredits}/send-api-key/`,
        });

        return apiCompletionPromise;
    };

}

export default PaymentAPI;