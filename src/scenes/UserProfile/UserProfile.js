import React from 'react';
import { Routes, Route } from "react-router-dom";
import UserProfileView from "./UserProfileView";

function UserProfile({ match }) {
    return (
        <Routes>
            <Route path={`${match.path}/:username/:tab`} component={UserProfileView} />
            <Route path={`${match.path}/:username/`} component={UserProfileView} />
            <Route path={`${match.path}/`} component={UserProfileView} />
        </Routes>
    );
}

export default UserProfile;