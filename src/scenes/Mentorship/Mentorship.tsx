import React from 'react';
import MentorsList from "./MentorsList";
import { Route, Switch } from "react-router-dom";

function Mentorship({ match }: { match: any}) {
    return (
        <Switch>
            <Route
                exact
                path={match.path}
                component={MentorsList}
            />
        </Switch>
    );
}

export default Mentorship;