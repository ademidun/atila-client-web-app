import React from 'react';
import { Routes, Route } from "react-router-dom";
import ApplicationDetail from "./ApplicationDetail";

function Application({ match }) {
    const basePath = match?.path || '';
    return (
        <Routes>
            <Route path={`${basePath}/local/scholarship_:scholarshipID`} element={<ApplicationDetail />} />
            <Route path={`${basePath}/:applicationID`} element={<ApplicationDetail />} />
        </Routes>
    );
}

export default Application;