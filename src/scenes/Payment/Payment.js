import React from 'react';
import { Route, Switch } from "react-router-dom";
import PaymentAccept from "./PaymentAccept";

function Payment({ match }) {
    return (
        <Switch>
            <Route path={`${match.path}/accept`} component={PaymentAccept} />
        </Switch>
    );
}

export default Payment;