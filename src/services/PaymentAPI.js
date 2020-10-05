import Environment from "./Environment";
import request from "axios";

class PaymentAPI {

    static apiUrlPayment = `${Environment.apiUrl}/payment`;

    /**
     *
     * @param accountData:{
      "user_profile": {
        "first_name": "",
        "last_name": "",
        "email": "",
      },
      "return_url": "https://atila.ca/payment/accept/?application=<application_id>",
      "refresh_url": "https://atila.ca/payment/accept/?application=<application_id>"
    }
     *
     * @returns {AxiosPromise}
     */
    static createAccount = (accountData) => {

        const apiCompletionPromise = request({
            url: `${PaymentAPI.apiUrlPayment}/create-account/`,
            data: accountData,
            method: 'post',
        });

        return apiCompletionPromise;
    };

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