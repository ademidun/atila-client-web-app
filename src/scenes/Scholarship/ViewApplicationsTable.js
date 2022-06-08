import React from "react";
import PropTypes from "prop-types";

class ViewApplicationsTable extends  React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                Table here
            </div>
        );
    }
}

ViewApplicationsTable.propTypes = {
    applications: PropTypes.array,
    scholarship: PropTypes.shape({}),
    loggedInUserProfile: PropTypes.shape({}),
};

export default ViewApplicationsTable
