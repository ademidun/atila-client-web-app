import React from 'react';
import MentorsList from "./MentorsList";
import { Route, Switch } from "react-router-dom";
import MentorshipSessionAddEdit from './MentorshipSession/MentorshipSessionAddEdit';
import MentorshipAbout from './MentorshipAbout';

type Props = {
    match: any;
};

// Use React.Component to ensure refs property exists for the route elements
class Mentorship extends React.Component<Props> {
    render() {
        const { match } = this.props;
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
}

export default Mentorship;