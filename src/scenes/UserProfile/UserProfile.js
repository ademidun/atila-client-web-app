import React from 'react';
import { Route, Switch } from "react-router-dom";
import UserProfileView from "./UserProfileView";
import UserProfileEdit from "./UserProfileEdit";

function UserProfile({ match }) {
    return (
        <Switch>
            <Route path={`${match.path}/:username`} component={UserProfileView} />
            <Route path={`${match.path}/edit/`} component={UserProfileEdit} />
        </Switch>
    );
}

export default UserProfile;