import Environment from "./Environment";
import request from "axios";

class PaymentAPI {

    static apiUrlPayment = `${Environment.apiUrl}/payment`;
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

    static saveWallet = (postData) => {

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

}

export default PaymentAPI;