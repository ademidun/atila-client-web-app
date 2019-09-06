import React from 'react';
import BlogsList from "./BlogsList";
import { Route, Switch } from "react-router-dom";
import BlogDetail from "./BlogDetail";
import BlogAddEdit from "./BlogAddEdit";

function Blog({ match }) {
    return (
        <Switch>
            <Route path={`${match.path}/add`} component={BlogAddEdit} />
            <Route path={`${match.path}/edit/:slug`} component={BlogAddEdit} />
            <Route path={`${match.path}/:username/:slug`} component={BlogDetail} />
            <Route
                exact
                path={match.path}
                component={BlogsList}
            />
        </Switch>
    );
}

export default Blog;