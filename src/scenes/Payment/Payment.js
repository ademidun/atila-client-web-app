import React from 'react';
import { Route, Switch } from "react-router-dom";
import PaymentAccept from "./PaymentAccept";
import PaymentSend from "./ScholarshipPayment/ScholarshipPaymentForm";

function Payment({ match }) {
    return (
        <Switch>
            <Route path={`${match.path}/accept`} component={PaymentAccept} />
            <Route path={`${match.path}/send`} component={PaymentSend} />
        </Switch>
    );
}

export default Payment;