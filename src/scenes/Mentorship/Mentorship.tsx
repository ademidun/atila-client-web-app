import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MentorshipAbout from './MentorshipAbout';
import MentorshipSessionAddEdit from './MentorshipSession/MentorshipSessionAddEdit';
import MentorsList from './MentorsList';

export interface MentorshipProps {
    match: {
        path: string;
    };
}

class Mentorship extends React.Component<MentorshipProps> {
    render() {
        const { match } = this.props;
        return (
            <div>
                <Routes>
                    <Route path="about" element={<MentorshipAbout />} />
                    <Route 
                        path="session/new/:mentorUsername" 
                        element={<MentorshipSessionAddEdit />} 
                    />
                    <Route 
                        path="session/:sessionId" 
                        element={<MentorshipSessionAddEdit />} 
                    />
                    <Route
                        path="/"
                        element={<MentorsList />}
                    />
                </Routes>
            </div>
        );
    }
}

export default Mentorship;