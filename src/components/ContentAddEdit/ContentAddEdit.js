import React from 'react';
import PropTypes from 'prop-types';
import CKEditor from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import {Helmet} from "react-helmet";
import {Link, withRouter} from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';
import {connect} from "react-redux";
import {slugify} from "../../services/utils";
import UtilsAPI from "../../services/UtilsAPI";
import {toastNotify} from "../../models/Utils";

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
                published: false,
                ...props.content
            },
            showPreview: false,
            contentPostError: null,
            contentGetError: null,
            isAddContentMode: false,
            showContentAddOptions: false
        }
    }

    componentDidMount() {

        const { contentType } = this.props;

        const { userProfile, match : { path }} = this.props;

        if ( path===`/${contentType.toLowerCase()}/add` ) {
            this.setState({isAddContentMode: true});
            const content = this.state.content;

            if(userProfile) {
                content.user = userProfile.user;
            }
            else {
                toastNotify(`⚠️ Warning, you must be logged in to add ${contentType}s`);
            }
            this.setState({content});
        } else {
            this.loadContent();
        }
    }

    loadContent = () => {
        UtilsAPI.loadContent(this);
    };

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

        this.setState({content},
            () => {this.submitForm();}
        );
    };

    editorChange = ( event, editor ) => {
        const data = editor.getData();
        const content = this.state.content;
        content.body = data;

        this.setState({content});
    };

    submitForm = (event) => {
        if(event){
            event.preventDefault();
        }
        const { ContentAPI, userProfile, contentType, match : { params : { slug, username }} } = this.props;

        if(!userProfile) {
            toastNotify(`⚠️ Warning, you must be logged in to add ${contentType}s`);
            return;
        }
        const { content, isAddContentMode } = this.state;

        let postResponsePromise = null;
        if (isAddContentMode) {
            postResponsePromise = ContentAPI.create(content);
        }
        else {
            content.user = content.user.id;
            postResponsePromise = ContentAPI.update(content.id, content);
        }
        postResponsePromise
            .then(res=> {
                this.setState({isAddContentMode: false});
                this.setState({content: res.data});
                const successMessage = (<p>
                    <span role="img" aria-label="happy face emoji">🙂</span>
                    Successfully saved {' '}
                    <Link to={`/${contentType.toLowerCase()}/${username}/${slug}`}>
                        {content.title}
                </Link></p>);
                toastNotify(successMessage, 'info', {position: 'bottom-right'});
            })
            .catch(err=> {
                console.log({err});
                this.setState({contentPostError: err.response && err.response.data})
            })
            .finally(()=>{});

    };

    render() {

        const { contentType, match : { params : { slug, username }}  } = this.props;
        const { isAddContentMode, contentPostError, showContentAddOptions} = this.state;

        const elementTitle = isAddContentMode ? `Add ${contentType}` : `Edit ${contentType}`;

        const { content : {
            title, description, published, header_image_url, body, essay_source_url
        } } = this.state;

        const defaultBody = '<p>Write your story here...</p>';

        return (
            <div className="mt-3">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{title && `${title} - `}{elementTitle} - Atila</title>
                </Helmet>
                <form className="row p-3 form-group" onSubmit={this.submitForm}>
                    <TextareaAutosize placeholder="Title"
                                      className="border-0 center-block text-center col-12"
                                      name="title"
                                      value={title}
                                      onChange={this.updateForm}
                                      style={{fontSize: '2.5rem'}}
                                      maxLength="140"
                    />
                    <button className="btn btn-link col-12 right"
                            type="button"
                            onClick={()=> this.setState({showContentAddOptions: !showContentAddOptions})}>
                        {showContentAddOptions && 'Hide'} Options
                    </button>
                    {slug && username &&
                    <Link to={`/${contentType.toLowerCase()}/${username}/${slug}`}>
                        View {contentType}
                    </Link>
                    }

                    {!published &&
                    <p  className="badge badge-secondary mx-1"
                        style={{ fontSize: 'small' }}>
                        Unpublished
                    </p>}
                    {showContentAddOptions &&
                    <div className="col-12">
                    <textarea placeholder="Description"
                              className="col-12 mb-3 form-control"
                              name="description"
                              value={description}
                              onChange={this.updateForm}
                    />
                        {contentType === 'Blog' &&
                        <input type="url"
                               name="header_image_url"
                               placeholder="Header Image Url"
                               className="col-12 mb-3 form-control"
                               onChange={this.updateForm}
                               value={header_image_url} />}
                        {contentType === 'Essay' &&
                        <input type="url"
                               name="essay_source_url"
                               placeholder="Essay Source Url"
                               className="col-12 mb-3 form-control"
                               onChange={this.updateForm}
                               value={essay_source_url} />}
                    </div>
                    }
                    {header_image_url &&
                    <img  src={header_image_url}
                          alt={title}
                          style={{width: '100%' }}/>
                    }
                    <CKEditor
                        editor={ InlineEditor }
                        data={body || defaultBody}
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
    hideImage: false,
    contentSlug: '',
    userProfile: null,
};

ContentAddEdit.propTypes = {
    hideImage: PropTypes.bool,
    className: PropTypes.string,
    content: PropTypes.shape({}),
    contentType: PropTypes.string.isRequired,
    contentSlug: PropTypes.string,
    ContentAPI: PropTypes.func.isRequired,
    userProfile: PropTypes.shape({}),
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default withRouter(connect(mapStateToProps)(ContentAddEdit));