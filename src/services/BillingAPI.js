import Environment from "./Environment";
import request from "axios";
class BillingAPI {

    static billingMicroserviceUrl = `${Environment.apiUrlBillingMicroservice}`;


    static chargePayment = (tokenId, name, email) => {

        const apiCompletionPromise = request({
            url: `${BillingAPI.billingMicroserviceUrl}/create-customer`,
            method: 'post',
            data: {tokenId, email, name},
        });

        return apiCompletionPromise;
    };

}

export default BillingAPI;