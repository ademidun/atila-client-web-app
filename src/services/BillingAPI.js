import Environment from "./Environment";
import request from "axios";
class BillingAPI {

    static billingMicroserviceUrl = `${Environment.apiUrlBillingMicroservice}`;
    static chargePayment = (tokenId) => {

        const apiCompletionPromise = request({
            url: `${BillingAPI.billingMicroserviceUrl}/create-customer`,
            method: 'post',
            data: {tokenId, email: 'tomiademidun+strip@gmail.com', productPlan: 'plan_G2wqtX5n0quawI' },
            headers: {"Content-Type": "text/plain"},
        });

        return apiCompletionPromise;
    };

}

export default BillingAPI;