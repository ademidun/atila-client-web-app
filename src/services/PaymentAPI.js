import Environment from "./Environment";
import request from "axios";

class PaymentAPI {

    static apiUrlPayment = `${Environment.apiUrlPayment}`;


    static createAccount = (userProfile) => {

        const apiCompletionPromise = request({
            url: `${PaymentAPI.apiUrlPayment}/accounts/create`,
            data: userProfile,
            method: 'post',
        });

        return apiCompletionPromise;
    };

}

export default PaymentAPI;