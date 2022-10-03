import React from 'react';
import MentorsList from "./MentorsList";
import { Route, Switch } from "react-router-dom";
import MentorshipSessionAddEdit from './MentorshipSession/MentorshipSessionAddEdit';
import MentorshipAbout from './MentorshipAbout';

function Mentorship({ match }: { match: any}) {
    return (
        <Switch>
            <Route path={`${match.path}/about`} component={MentorshipAbout} />
            <Route path={`${match.path}/session/new/:mentorUsername`} component={MentorshipSessionAddEdit} />
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