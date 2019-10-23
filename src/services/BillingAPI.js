import Environment from "./Environment";
import request from "axios";
class BillingAPI {

    static billingMicroserviceUrl = `${Environment.apiUrlBillingMicroservice}`;
    static chargePayment = (tokenId) => {

        const apiCompletionPromise = request({
            url: `${BillingAPI.billingMicroserviceUrl}/charge`,
            method: 'post',
            data: tokenId,
            headers: {"Content-Type": "text/plain"},
        });

        return apiCompletionPromise;
    };

}

export default BillingAPI;