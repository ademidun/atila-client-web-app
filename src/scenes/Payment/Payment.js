import React from 'react';
import { Route, Switch } from "react-router-dom";
import PaymentOnboarding from "./PaymentOnboarding";

function Blog({ match }) {
    return (
        <Switch>
            <Route path={`${match.path}/onboarding/start`} component={PaymentOnboarding} />
        </Switch>
    );
}

export default Blog;