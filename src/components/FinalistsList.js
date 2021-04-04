import React from 'react';

import ScholarshipFinalists from "../scenes/Scholarship/ScholarshipFinalists";

class FinalistsList extends React.Component {

    render () {
        return (
            <div className="card shadow container p-3 my-3" id="finalists">
                <ScholarshipFinalists itemType={"essay"} allFinalists={true} title="Finalists" showEssaysFirst={true}
                    search={this.props.location.search}/>
            </div>
        );
    }
}

export default FinalistsList;