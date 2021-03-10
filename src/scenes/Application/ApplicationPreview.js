import React from 'react';
import { stripHtml } from '../../services/utils';

export function ApplicationPreview({ application }){

    const applicationResponses = application.scholarship_responses;
    if (!applicationResponses || Object.values(applicationResponses).length === 0) {
        return null
    }



    let applicationResponsePreview = Object.values(applicationResponses)[0];
    
    applicationResponsePreview =  applicationResponsePreview.type === "long_answer" ? stripHtml(applicationResponsePreview.response) : applicationResponsePreview.response;
    applicationResponsePreview = applicationResponsePreview.substring(0, 140);

    return (<div>
        Preview: 
            <p className="text-muted">
            {applicationResponsePreview}...
            </p>
    </div>)
}