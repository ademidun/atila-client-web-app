import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import MentorshipAbout from './MentorshipAbout';
import MentorshipSessionAddEdit from './MentorshipSession/MentorshipSessionAddEdit';
import MentorsList from './MentorsList';

export interface MentorshipProps {
    basePath: string;
}

function Mentorship({ basePath }: MentorshipProps) {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div>
            <Routes>
                <Route path={`${basePath}/about`} element={<MentorshipAbout />} />
                <Route 
                    path={`${basePath}/session/new/:mentorUsername`} 
                    element={<MentorshipSessionAddEdit />} 
                />
                <Route 
                    path={`${basePath}/session/:sessionId`} 
                    element={<MentorshipSessionAddEdit />} 
                />
                <Route
                    path={basePath}
                    element={<MentorsList />}
                />
            </Routes>
        </div>
    );
}

export default Mentorship;