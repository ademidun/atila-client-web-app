import Environment from "./Environment";
import request from "axios";
class BillingAPI {

    static billingMicroserviceUrl = `${Environment.apiUrlBillingMicroservice}`;


    static chargePayment = (tokenId, name, email, metadata) => {

        const apiCompletionPromise = request({
            url: `${BillingAPI.billingMicroserviceUrl}/create-customer-and-subscribe`,
            method: 'post',
            data: {tokenId, email, name, metadata},
        });

        return apiCompletionPromise;
    };
    static sendBillingError = (error, userProfile) => {

        const apiCompletionPromise = request({
            url: `${BillingAPI.billingMicroserviceUrl}/send-billing-error`,
            method: 'post',
            data: {error, userProfile},
        });

        return apiCompletionPromise;
    };
    static getCustomer = (customerId) => {

        const apiCompletionPromise = request({
            url: `${BillingAPI.billingMicroserviceUrl}/customer/${customerId}`,
            method: 'get',
        });

        return apiCompletionPromise;
    };
    static cancelSubscription = (customerId, subscriptionId) => {

        const apiCompletionPromise = request({
            url: `${BillingAPI.billingMicroserviceUrl}/customer/${customerId}/cancel-subscription`,
            method: 'post',
            data: {subscriptionId},
        });

        return apiCompletionPromise;
    };

}

export default BillingAPI;