import React from 'react';
import MentorsList from "./MentorsList";
import { Route, Switch } from "react-router-dom";
import MentorshipSessionAddEdit from './MentorshipSession/MentorshipSessionAddEdit';

function Mentorship({ match }: { match: any}) {
    return (
        <Switch>
            <Route path={`${match.path}/session/new`} component={MentorshipSessionAddEdit} />
            <Route path={`${match.path}/session/:sessionId`} component={MentorshipSessionAddEdit} />
            <Route
                exact
                path={match.path}
                component={MentorsList}
            />
        </Switch>
    );
}

export default Mentorship;