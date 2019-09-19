import React from 'react';
import PropTypes from 'prop-types';
import CKEditor from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import {Helmet} from "react-helmet";
import {withRouter} from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';
import {connect} from "react-redux";
import {slugify} from "../../services/utils";

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
            contentPostError: null,
            isAddContentMode: false,
        }
    }

    componentDidMount() {
        console.log('componentDidMount');

        const { contentType } = this.props;
        console.log('this.props', this.props);

        const { userProfile, match : { path }} = this.props;

        if ( path===`/${contentType.toLowerCase()}/add` ) {
            this.setState({isAddContentMode: true});
            const content = this.state.content;
            content.user = userProfile.user;
            this.setState({content});
        } else {
            // this.loadContent();
        }
    }

    updateForm = (event) => {
        event.preventDefault();
        const content = this.state.content;
        if(event.target.name==='title') {
            content.slug = slugify(event.target.value);
        }
        content[event.target.name] = event.target.value;
        this.setState({content});
    };

    togglePublish = (event) => {
        event.preventDefault();
        const content = this.state.content;
        content.published = !content.published;
        this.setState({content});
    };

    editorChange = ( event, editor ) => {
        const data = editor.getData();
        console.log( { event, editor, data } );

        const content = this.state.content;
        content.body = data;

        this.setState({content});
    };

    editorInit = editor => {
        console.log( 'Editor is ready to use!', editor );
    };

    editorBlur = ( event, editor ) => {
        console.log( 'Blur.', editor );
    };

    editorFocus = ( event, editor ) => {
        console.log( 'Focus.', editor );
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
                this.setState({isAddContentMode: false});
                this.setState({content: res.data});
            })
            .catch(err=> {
                console.log({err});
                this.setState({contentPostError: err.response && err.response.data})
            })
            .finally(()=>{});

    };

    render() {

        const { contentType } = this.props;
        const { isAddContentMode, contentPostError} = this.state;

        const elementTitle = isAddContentMode ? `Add ${contentType}` : `Edit ${contentType}`;

        const { content : {
            title, description, published
        } } = this.state;

        return (
            <div className="mt-3">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{title} - {elementTitle} - Atila</title>
                </Helmet>
                <form className="row p-3 form-group" onSubmit={this.submitForm}>
                    {!isAddContentMode &&
                    <h1>{elementTitle}: {title}</h1>}
                    {isAddContentMode &&

                    <TextareaAutosize placeholder="Title"
                                      className="border-0 center-block serif-font text-center col-12"
                                      name="title"
                                      value={title}
                                      onChange={this.updateForm}
                                      style={{fontSize: '2.5rem'}}
                                      maxLength="140"
                    />
                    }
                    <textarea placeholder="Description"
                              className="col-12 mb-3 form-control"
                              name="description"
                              value={description}
                              onChange={this.updateForm}
                    />

                    <CKEditor
                        editor={ InlineEditor }
                        data="<p>Write your story here...</p>"
                        onInit={ this.editorInit }
                        onChange={ this.editorChange }
                        onBlur={ this.editorBlur }
                        onFocus={ this.editorFocus }
                    />
                    {contentPostError &&
                    <pre className="text-danger" style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(contentPostError, null, 4)}
                    </pre>
                    }

                    <div className="col-12 my-3">
                        <button type="submit"
                                className="btn btn-primary center-block">
                            Save
                        </button>
                    </div>
                    <div className="col-12">
                        <button type="button"
                                onClick={this.togglePublish}
                                className="btn btn-primary center-block">
                            { published ? 'Unpublish': 'Publish'}
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
    userProfile: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default withRouter(connect(mapStateToProps)(ContentAddEdit));