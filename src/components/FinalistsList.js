import React from 'react';

import ScholarshipFinalists from "../scenes/Scholarship/ScholarshipFinalists";

class FinalistsList extends React.Component {

    render () {
        return (

            <div className="my-3" id="finalists">
                <ScholarshipFinalists itemType={"essay"} allFinalists={true} title="Finalists" />
            </div>
        );
    }
}

export default FinalistsList;