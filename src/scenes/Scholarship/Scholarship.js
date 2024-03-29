import React from 'react';
import ScholarshipsList from "./ScholarshipsList";
import {Route, Switch} from "react-router-dom";
import ScholarshipDetail from "./ScholarshipDetail";
import ScholarshipAddEdit from "./ScholarshipAddEdit";
import ScholarshipManage from "./ScholarshipManage";
import ScholarshipViewQuestions from "./ScholarshipViewQuestions";
import ScholarshipContribution from "./ScholarshipContribution";

function Scholarship({ match }) {
    return (
        <Switch>
            <Route path={`${match.path}/:scholarshipID/manage`} component={ScholarshipManage} />
            <Route path={`${match.path}/:slug/contribute`} component={ScholarshipContribution} />
            <Route path={`${match.path}/:slug/questions`} component={ScholarshipViewQuestions} />
            <Route path={`${match.path}/add`} component={ScholarshipAddEdit} />
            <Route path={`${match.path}/s/:searchString`} component={ScholarshipsList} />
            <Route path={`${match.path}/direct`} component={ScholarshipsList} />
            <Route path={`${match.path}/edit/:slug`} component={ScholarshipAddEdit} />
            <Route path={`${match.path}/:slug`} component={ScholarshipDetail} />
            <Route
                exact
                path={match.path}
                component={ScholarshipsList}
            />
        </Switch>
    );
}

export default Scholarship;