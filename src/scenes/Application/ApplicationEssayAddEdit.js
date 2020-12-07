import React from 'react';
import PropTypes from 'prop-types';
import ContentAddEdit from "../../components/ContentAddEdit/ContentAddEdit";
import ApplicationsApi from "../../services/ApplicationsAPI";

function ApplicationEssayAddEdit({application}){

    return (
        <div className="text-center container">
            <ContentAddEdit contentType="Application"
                            ContentAPI={ApplicationsApi}
                            content={application} />
        </div>
    );
}
ApplicationEssayAddEdit.defaultProps = {
    application: null,
};

ApplicationEssayAddEdit.propTypes = {
    className: PropTypes.string,
};

export default ApplicationEssayAddEdit;
