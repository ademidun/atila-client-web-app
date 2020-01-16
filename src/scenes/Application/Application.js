import React from 'react';
import {Route, Switch} from "react-router-dom";
import ApplicationDetail from "./ApplicationDetail";

function Scholarship({ match }) {
    return (
        <Switch>
            <Route path={`${match.path}/:appId`} component={ApplicationDetail} />
            <Route component={ApplicationDetail} />
        </Switch>
    );
}

export default Scholarship;