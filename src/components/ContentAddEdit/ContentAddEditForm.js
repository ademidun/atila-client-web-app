import React from 'react';
import PropTypes from 'prop-types';

class ContentAddEditForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            content: {
                title: '',
                slug: '',
                description: '',
                body: '',
                essay_source_url: '',
                header_image_url: '',
            }
        }
    }

    updateForm = (event) => {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value})
    };

    render() {

        const { content : {
            title, slug, description, body, essay_source_url, header_image_url
        } } = this.state;
        return (
            <form className="row p-3 form-group" onSubmit={this.submitForm}>
                <input placeholder="Title"
                       className="col-12 mb-3 form-control"
                       name="title"
                       value={title}
                       onChange={this.updateForm}
                />

                <textarea placeholder="Description"
                       className="col-12 mb-3 form-control"
                       name="description"
                       value={description}
                       onChange={this.updateForm}
                />

            </form>
        )
    }
}



ContentAddEditForm.defaultProps = {
    className: '',
};

ContentAddEditForm.propTypes = {
    className: PropTypes.string,
    content: PropTypes.shape({})
};

export default ContentAddEditForm;