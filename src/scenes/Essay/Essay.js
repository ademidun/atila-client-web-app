import React from 'react';
import EssaysList from "./EssaysList";
import { Route, Switch } from "react-router-dom";
import EssayDetail from "./EssayDetail";
import EssayAddEdit from "./EssayAddEdit";

function Essay({ match }) {
    return (
        <Switch>
            <Route path={`${match.path}/add`} component={EssayAddEdit} />
            <Route path={`${match.path}/edit/:username/:slug`} component={EssayAddEdit} />
            <Route path={`${match.path}/:username/:slug`} component={EssayDetail} />
            <Route
                exact
                path={match.path}
                component={EssaysList}
            />
        </Switch>
    );
}

export default Essay;