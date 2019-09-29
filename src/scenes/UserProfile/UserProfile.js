import React from 'react';
import { Route, Switch } from "react-router-dom";
import UserProfileView from "./UserProfileView";

function UserProfile({ match }) {
    return (
        <Switch>
            <Route path={`${match.path}/:username/:tab`} component={UserProfileView} />
            <Route path={`${match.path}/:username/`} component={UserProfileView} />
        </Switch>
    );
}

export default UserProfile;