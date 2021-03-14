import React from 'react';
import PropTypes from 'prop-types';
import ContentAddEdit from "../../components/ContentAddEdit/ContentAddEdit";
import ApplicationsApi from "../../services/ApplicationsAPI";
import { Switch } from 'antd';

class ApplicationEssayAddEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          isAnonymous: false,
        };
    }

    onAnonymousChecked = (newChecked) => {
        this.setState({isAnonymous: newChecked});
    }

    render () {
        const { isAnonymous } = this.state;
        const { application } = this.props;

        let publishText = isAnonymous ? 'Publish Anonymously' : 'Publish'
        return (
            <div className="container">
            <Switch checked={isAnonymous} onChange={this.onAnonymousChecked} />
            {' '} Remain anonymous
            <div className="text-center">
                <ContentAddEdit contentType="Application"
                                ContentAPI={ApplicationsApi}
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
