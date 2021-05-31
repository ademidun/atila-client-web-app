import React from 'react';
import PropTypes from 'prop-types';
import CKEditor from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import {Helmet} from "react-helmet";
import { Button, Popconfirm } from 'antd';
import {Link, withRouter} from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';
import {connect} from "react-redux";
import {slugify} from "../../services/utils";
import UtilsAPI from "../../services/UtilsAPI";
import {toastNotify} from "../../models/Utils";
import Loading from "../Loading";
import ApplicationsAPI from '../../services/ApplicationsAPI';
import AutoCompleteRemoteData from "../AutoCompleteRemoteData";
import {UserProfilePreview} from "../ReferredByInput";
import {MinusCircleOutlined} from "@ant-design/icons";
import ButtonModal from "../ButtonModal";

const defaultContent = {
    title: '',
    slug: '',
    description: '',
    body: '',
    essay_source_url: '',
    header_image_url: '',
    published: false,
};

class ContentAddEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            content: defaultContent,
            showPreview: false,
            contentPostError: null,
            contentGetError: null,
            isAddContentMode: false,
            showContentAddOptions: false,
            // CKEditor doesn't get updated when the state changes,
            // so we hve to set isLoading to true by default.
            // this way the CkEditor only gets rendered when the data has been loaded
            // (when content.body has been loaded).
            isLoading: `Loading ${props.contentType}`,
            invitedContributor: null,
        }
    }

    componentDidMount() {

        const { contentType } = this.props;

        const { userProfile, match : { path }} = this.props;

        if ( path===`/${contentType.toLowerCase()}/add` ) {
            this.setState({isAddContentMode: true, isLoading: false});
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
        if (this.props.content) {
            this.setState({content: this.props.content, isLoading: false});
        } else {
            UtilsAPI.loadContent(this);
        }
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

    generateEssayFromResponses = () => {

        let { content } = this.state;

        const questions = Object.keys(content.scholarship_responses);
        const published = content.published;
        this.setState({isLoading: "Autogenerating essay using your scholarship response"});
        ApplicationsAPI.convertApplicationToEssay(content.id, questions, published).then(res => {

            const { description, body } = res.data.application;

            this.setState({
                content: {
                    ...this.state.content,
                    body,
                    description,
                } 
            });
        })
        .catch(err => {
            this.setState({contentGetError: { err }});
        })
        .finally(() => {
            this.setState({isLoading: false});
        });
    }

    submitForm = (event) => {
        if(event){
            event.preventDefault();
        }
        const { ContentAPI, userProfile, contentType } = this.props;
        const { content, isAddContentMode } = this.state;

        if(!userProfile) {
            toastNotify(`⚠️ Warning, you must be logged in to add ${contentType}s`);
            return;
        }

        let postResponsePromise = null;
        if (isAddContentMode) {
            postResponsePromise = ContentAPI.create(content);
        }
        else {
            content.user = content.user.id;
            const contentToPatch = {};
            Object.keys(defaultContent).forEach(defaultContentKey => {
                contentToPatch[defaultContentKey] = content[defaultContentKey]
            });
            postResponsePromise = ContentAPI.patch(content.id, contentToPatch);
        }
        postResponsePromise
            .then(res=> {
                this.setState({isAddContentMode: false});
                const updatedContent = res.data;
                this.setState({content: updatedContent});
                let { match : { params : { slug, username }} } = this.props;

                if (updatedContent.user) {
                    username = updatedContent.user.username;
                }
                if (updatedContent.slug) {
                    slug = updatedContent.slug;
                }

                // When viewing an application, we will use the same url structure as essays
                let contentTypeForSlug = contentType.toLowerCase();
                if (contentTypeForSlug === "application") {
                    contentTypeForSlug = "essay"
                }
                const successMessage = (
                    <>
                    <p>
                    <span role="img" aria-label="happy face emoji">🙂</span>
                    Successfully saved {' '}
                    <Link to={`/${contentTypeForSlug}/${username}/${slug}`}>
                        {content.title}
                </Link></p>
                        {!updatedContent.published && <small>Must be published to view</small>}
                    </>
                        );
                toastNotify(successMessage, 'info', {position: 'bottom-right'});
            })
            .catch(err=> {
                console.log({err});
                this.setState({contentPostError: err.response && err.response.data})
            })
            .finally(()=>{});

    };

    inviteContributor = () => {
        const { ContentAPI } = this.props;
        const { content, invitedContributor } = this.state;
        this.setState({isLoading: "Inviting contributor..."});
        ContentAPI
            .inviteContributor(content.id, invitedContributor.username)
            .then(res => {
                // invites_sent is also in res.data
                toastNotify(`${invitedContributor.username} has been sent an invite email.`)

                this.setState({invitedContributor: null});
                if (res.data.blog) {
                    this.setState({content: res.data.blog});
                } else if( res.data.essay) {
                    this.setState({content: res.data.essay});
                }
            })
            .catch(err => {
                console.log({err});
                const { response_message } = err.response.data;
                if (response_message) {
                    toastNotify(response_message, "error")
                } else {
                    toastNotify(`There was an error inviting ${invitedContributor}.\n\n 
                    Please message us using the chat icon in the bottom right of your screen.`, "error")
                }
            })
            .then(() => {
                this.setState({isLoading: null});
            });
    }

    render() {

        const { userProfile, contentType, match : { params : { slug, username }}  } = this.props;
        const { isAddContentMode, contentPostError, showContentAddOptions, isLoading, invitedContributor } = this.state;

        const elementTitle = isAddContentMode ? `Add ${contentType}` : `Edit ${contentType}`;

        const { content : {
            title, description, published, header_image_url, body, essay_source_url, user
        } } = this.state;

        if (!isAddContentMode && isLoading) {
            return (<div>
                <Loading title={isLoading}/>
            </div>);
        }
        const contentActions = (

            <div className="col-12">
            {contentType === "Application" && 
                <div className="col-12 my-3">
                    <Popconfirm placement="topRight" 
                                title="This will overwrite your current essay. 
                                Are you sure?" 
                                onConfirm={this.generateEssayFromResponses}>

                        <Button type="primary">
                            Autogenerate essay using scholarship responses
                        </Button>
                    </Popconfirm>
                </div>
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
        </div>
    
        )

        let isOwner = userProfile?.username === user.username

        let inviteContributorModalBody = (
            <>
                <AutoCompleteRemoteData placeholder={"Contributor's username or name..."}
                                        onSelect={(userProfile)=>{this.setState({invitedContributor: userProfile})}}
                                        type="user" />

                {invitedContributor &&
                <div className="my-2">
                    Pending invite: <br/>
                    <UserProfilePreview userProfile={invitedContributor} />

                    <MinusCircleOutlined
                        style={{
                            fontSize: "30px",
                        }}
                        onClick={()=>{
                            this.setState({invitedContributor: null})
                        }}
                    />
                </div>
                }
            </>
        )

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
                    {contentActions}
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
                    {published &&
                    <p  className="badge badge-primary mx-1"
                        style={{ fontSize: 'small' }}>
                        Published
                    </p>}
                    {showContentAddOptions &&
                    <div className="col-12">
                        {/*
                            If there is already a description, we will include a <p> element
                            that allows the user to see the application.
                        */}
                        {description && <p className="text-muted">Description</p>}
                    <textarea placeholder="Description"
                              className="col-12 mb-3 form-control"
                              name="description"
                              value={description}
                              onChange={this.updateForm}
                    />
                        {contentType === 'Blog' &&
                        <>
                            <input type="url"
                               name="header_image_url"
                               placeholder="Header Image Url"
                               className="col-12 mb-3 form-control"
                               onChange={this.updateForm}
                               value={header_image_url} />

                            {isOwner &&
                                <>
                                <ButtonModal
                                    showModalButtonSize={"medium"}
                                    showModalText={"Invite Contributor..."}
                                    modalTitle={"Invite Contributor"}
                                    modalBody={inviteContributorModalBody}
                                    submitText={"Send Invite"}
                                    onSubmit={this.inviteContributor}
                                    disabled={isLoading}
                                />
                                <br />
                                </>
                            }
                         </>
                         }
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
                        data={body}
                        onChange={ this.editorChange }
                    />
                    {contentPostError &&
                    <pre className="text-danger" style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(contentPostError, null, 4)}
                    </pre>
                    }
                    {contentActions}
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