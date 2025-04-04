import React from 'react';
import ScholarshipsList from "./ScholarshipsList";
import {Routes, Route} from "react-router-dom";
import ScholarshipDetail from "./ScholarshipDetail";
import ScholarshipAddEdit from "./ScholarshipAddEdit";
import ScholarshipManage from "./ScholarshipManage";
import ScholarshipViewQuestions from "./ScholarshipViewQuestions";
import ScholarshipContribution from "./ScholarshipContribution";

function Scholarship({ match }) {
    return (
        <Routes>
            <Route path=":scholarshipID/manage" element={<ScholarshipManage />} />
            <Route path=":slug/contribute" element={<ScholarshipContribution />} />
            <Route path=":slug/questions" element={<ScholarshipViewQuestions />} />
            <Route path="add" element={<ScholarshipAddEdit />} />
            <Route path="s/:searchString" element={<ScholarshipsList />} />
            <Route path="direct" element={<ScholarshipsList />} />
            <Route path="edit/:slug" element={<ScholarshipAddEdit />} />
            <Route path=":slug" element={<ScholarshipDetail />} />
            <Route path="/" element={<ScholarshipsList />} />
        </Routes>
    );
}

export default Scholarship;