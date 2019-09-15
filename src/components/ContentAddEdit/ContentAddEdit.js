import React from 'react';
import PropTypes from 'prop-types';
import ContentAddEditForm from "./ContentAddEditForm";

class ContentAddEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showPreview: false,
        }
    }

    render() {

        const { contentType } = this.props;
        return (
            <div>
                <h1>{contentType} Add Edit</h1>
                <ContentAddEditForm />
            </div>
        )
    }
}



ContentAddEdit.defaultProps = {
    className: '',
    hideImage: false
};

ContentAddEdit.propTypes = {
    hideImage: PropTypes.bool,
    className: PropTypes.string,
    content: PropTypes.shape({}),
    contentType: PropTypes.string.isRequired,
};

export default ContentAddEdit;