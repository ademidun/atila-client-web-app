import React from 'react';
import PropTypes from 'prop-types';
import ContentAddEdit from "../../components/ContentAddEdit/ContentAddEdit";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import { Switch } from 'antd';

class ApplicationEssayAddEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          isAnonymousEssay: false,
        };
    }

    onAnonymousChecked = (newChecked) => {
        const { application } = this.props;
        this.setState({isAnonymousEssay: newChecked});
        ApplicationsAPI
            .patch(application.id, {is_anonymous_essay: newChecked})
            .catch(err => {
                console.log({err});
            })
    }

    render () {
        const { isAnonymousEssay } = this.state;
        const { application } = this.props;

        let publishText = isAnonymousEssay ? 'Publish Anonymously' : 'Publish'
        return (
            <div className="container">
            <Switch checked={isAnonymousEssay} onChange={this.onAnonymousChecked} />
                {'  '} <b>Publish essay anonymously</b>
            <div className="text-center">
                <ContentAddEdit contentType="Application"
                                ContentAPI={ApplicationsAPI}
                                content={application}
                                publishText={publishText}
                />
            </div>
            </div>
        );
    }
}
ApplicationEssayAddEdit.defaultProps = {
    application: null,
};

ApplicationEssayAddEdit.propTypes = {
    className: PropTypes.string,
};

export default ApplicationEssayAddEdit;
