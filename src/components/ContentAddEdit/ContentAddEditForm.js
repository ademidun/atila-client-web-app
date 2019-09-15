import React from 'react';
import PropTypes from 'prop-types';

import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';

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

                <CKEditor
                    editor={ InlineEditor }
                    data="<h1>Title</h1>&nbsp;<p>Enter some text here...</p>"
                    onInit={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
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