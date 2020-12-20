import Environment from "./Environment";
import request from "axios";

class PaymentAPI {

    static apiUrlPayment = `${Environment.apiUrl}/payment`;

    static getClientSecret = (paymentData) => {

        const apiCompletionPromise = request({
            url: `${PaymentAPI.apiUrlPayment}/get-client-secret/`,
            method: 'post',
            data: paymentData,
        });

        return apiCompletionPromise;
    };

}

export default PaymentAPI;