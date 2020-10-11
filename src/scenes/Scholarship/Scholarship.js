import React from 'react';
import ScholarshipsList from "./ScholarshipsList";
import {Route, Switch} from "react-router-dom";
import ScholarshipDetail from "./ScholarshipDetail";
import ScholarshipAddEdit from "./ScholarshipAddEdit";
import ScholarshipManage from "./ScholarshipManage";

function Scholarship({ match }) {
    return (
        <Switch>
            <Route path={`${match.path}/:scholarshipID/manage`} component={ScholarshipManage} />
            <Route path={`${match.path}/add`} component={ScholarshipAddEdit} />
            <Route path={`${match.path}/s/:searchString`} component={ScholarshipsList} />
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