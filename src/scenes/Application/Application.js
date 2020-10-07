import React from 'react';
import {Route, Switch} from "react-router-dom";
import ApplicationDetail from "./ApplicationDetail";

function Application({ match }) {
    return (
        <Switch>
            <Route path={`${match.path}/:applicationID`} component={ApplicationDetail} />
        </Switch>
    );
}

export default Application;