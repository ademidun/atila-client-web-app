import Environment from "./Environment";
import request from "axios";

class PaymentAPI {

    static apiUrlPayment = `${Environment.apiUrl}/payment`;
    static apiUrlTransactions = `${PaymentAPI.apiUrlPayment}/transactions`;

    static getClientSecret = (paymentData) => {

        const apiCompletionPromise = request({
            url: `${PaymentAPI.apiUrlPayment}/get-client-secret/`,
            method: 'post',
            data: paymentData,
        });

        return apiCompletionPromise;
    };

    static saveTransaction = (transactionData) => {

        const apiCompletionPromise = request({
            url: `${PaymentAPI.apiUrlTransactions}/`,
            method: 'post',
            data: transactionData,
        });

        return apiCompletionPromise;
    };

}

export default PaymentAPI;