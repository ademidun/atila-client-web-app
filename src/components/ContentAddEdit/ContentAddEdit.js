import React from 'react';
import PropTypes from 'prop-types';
import CKEditor from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import {Helmet} from "react-helmet";
import {withRouter} from "react-router-dom";

class ContentAddEdit extends React.Component {

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
            },
            showPreview: false,
            isAddContentMode: false,
        }
    }

    componentDidMount() {
        console.log('componentDidMount');

        const { contentType } = this.props;
        console.log('this.props', this.props);

        const { match : { path }} = this.props;

        if ( path===`/${contentType.toLowerCase()}/add` ) {
            this.setState({isAddContentMode: true});
        } else {
            // this.loadContent();
        }
    }

    updateForm = (event) => {
        event.preventDefault();
        const content = this.state.content;
        content[event.target.name] = event.target.value;
        this.setState({content});
    };

    editorChange = ( event, editor ) => {
        const data = editor.getData();
        console.log( { event, editor, data } );

        const content = this.state.content;
        content.body = data;

        this.setState({content});
    };

    submitForm = (event) => {
        event.preventDefault();
        const { ContentAPI } = this.props;
        const { content, isAddContentMode } = this.state;

        let postResponsePromise = null;
        if (isAddContentMode) {
            postResponsePromise = ContentAPI.create(content);
        }
        postResponsePromise
            .then(res=> {
                console.log({res});
            })
            .catch(err=> {
                console.log({err});
            })
            .finally(()=>{});

    };

    render() {

        const { contentType } = this.props;
        const { isAddContentMode} = this.state;

        const elementTitle = isAddContentMode ? `Add ${contentType}` : `Edit ${contentType}`;

        const { content : {
            title, description
        } } = this.state;

        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{title} - Atila</title>
                </Helmet>
                <h1>{elementTitle}</h1>
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
                        onChange={ this.editorChange }
                        onBlur={ ( event, editor ) => {
                            console.log( 'Blur.', editor );
                        } }
                        onFocus={ ( event, editor ) => {
                            console.log( 'Focus.', editor );
                        } }
                    />

                    <div className="col-12">
                        <button type="submit"
                                className="btn btn-primary center-block">
                            Save
                        </button>
                    </div>

                </form>
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
    ContentAPI: PropTypes.func.isRequired,
};

export default withRouter(ContentAddEdit);