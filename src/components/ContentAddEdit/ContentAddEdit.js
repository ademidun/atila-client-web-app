import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import CKEditor from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import { Helmet } from "react-helmet";
import { Alert, Button, Popconfirm, Radio, Form, Input, Select } from 'antd';
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';
import { connect } from "react-redux";
import { getErrorMessage, slugify } from "../../services/utils";
import { toastNotify } from "../../models/Utils";
import Loading from "../Loading";
import ApplicationsAPI from '../../services/ApplicationsAPI';
import AutoCompleteRemoteData from "../AutoCompleteRemoteData";
import { UserProfilePreview } from "../ReferredByInput";
import { MinusCircleOutlined } from "@ant-design/icons";
import ButtonModal from "../ButtonModal";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import FormInputConstants from '../../models/FormInputConstants';
import LinkContentToWallet from '../Crypto/LinkContentToWallet';
import ContentBody from '../ContentDetail/ContentBody/ContentBody';
import { UserProfileAPI } from '../../services/UserProfileAPI';
import './ContentAddEdit.scss';
import BlogsApi from '../../services/BlogsAPI';
import EssaysApi from '../../services/EssaysAPI';


const defaultContent = {
    title: '',
    slug: '',
    description: '',
    body: '',
    body_type: 'html',
    essay_source_url: '',
    header_image_url: '',
    video_url: '',
    slides_url: '',
    published: true,
    contributors: []
};

// TODO use dynamic max character limit based on the type of content
// TODO All content should have the same character legnth maximum (that change needs to be made in the backend)
const descriptionCharacterLengthMax = 400;

function ContentAddEdit({ contentType, userProfile }) {
    const location = useLocation();
    const { slug, username } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    const [content, setContent] = useState(defaultContent);
    const [contentPostError, setContentPostError] = useState(null);
    const [contentGetError, setContentGetError] = useState(null);
    const [isAddContentMode, setIsAddContentMode] = useState(false);
    const [showContentAddOptions, setShowContentAddOptions] = useState(true);
    const [isLoading, setIsLoading] = useState(`Loading ${contentType}`);
    const [isLoadingContributorInvite, setIsLoadingContributorInvite] = useState(false);
    const [invitedContributor, setInvitedContributor] = useState(null);
    const [contributors, setContributors] = useState([]);
    const [selectedContributors, setSelectedContributors] = useState([]);
    const [searchContributorsQuery, setSearchContributorsQuery] = useState('');

    const ContentAPI = contentType === 'essay' ? EssaysApi : BlogsApi;

    useEffect(() => {
        if (location.pathname === `/${contentType.toLowerCase()}/add`) {
            setIsAddContentMode(true);
            setIsLoading(false);
            if (userProfile) {
                setContent(prev => ({ ...prev, user: userProfile.user }));
            } else {
                toastNotify(`⚠️ Warning, you must be logged in to add ${contentType}s`);
            }
        } else {
            loadContent();
        }
    }, [contentType, location.pathname, userProfile]);

    const loadContent = async () => {
        setIsLoading('Loading content...');
        try {
            const response = await ContentAPI.getSlug(slug);
            const content = response.data.blog || response.data.essay;
            setContent(content);
            form.setFieldsValue({
                title: content.title,
                description: content.description,
                body: content.body,
                body_type: content.body_type || 'html',
                header_image_url: content.header_image_url,
                video_url: content.video_url,
                slides_url: content.slides_url,
                published: content.published,
                contributors: content.contributors?.map(c => c.username) || []
            });
            if (content.contributors) {
                setSelectedContributors(content.contributors);
            }
        } catch (error) {
            console.error('Error loading content:', error);
            setContentGetError(getErrorMessage(error));
        } finally {
            setIsLoading('');
        }
    };




    const updateForm = (event) => {
        event.preventDefault();
        let { name, value } = event.target;
        
        if (name === 'title') {
            setContent(prev => ({ ...prev, slug: slugify(value), [name]: value }));
        } else if (name === 'description' && value.length >= 400) {
            value = value.substring(0, 400);
            setContent(prev => ({ ...prev, [name]: value }));
        } else {
            setContent(prev => ({ ...prev, [name]: value }));
        }
    };

    const togglePublish = (event) => {
        event.preventDefault();
        setContent(prev => ({ ...prev, published: !prev.published }), () => {
            submitForm();
        });
    };

    const editorChange = (event, editor) => {
        const data = editor.getData();
        setContent(prev => ({ ...prev, body: data }));
    };

    const generateEssayFromResponses = () => {
        setIsLoading("Autogenerating essay using your scholarship response");
        ApplicationsAPI.convertApplicationToEssay(content.id, Object.keys(content.scholarship_responses), content.published)
            .then(res => {
                const { description, body } = res.data.application;
                setContent(prev => ({ ...prev, body, description }));
            })
            .catch(err => {
                setContentGetError({ err });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const submitForm = async (event) => {
        if (event) {
            event.preventDefault();
        }

        if (!userProfile) {
            toastNotify(`⚠️ Warning, you must be logged in to add ${contentType}s`);
            return;
        }

        setIsLoading('Saving content...');
        try {
            const contentData = {
                ...content,
                contributors: selectedContributors.map(c => c.id)
            };

            let response;
            if (isAddContentMode) {
                response = await ContentAPI.create(contentData);
            } else {
                response = await ContentAPI.update(content.id, contentData);
            }

            const savedContent = response.data;
            setIsAddContentMode(false);
            setContent(savedContent);

            const contentUsername = savedContent.user?.username || username;
            const contentSlug = savedContent.slug || slug;
            let contentTypeForSlug = contentType.toLowerCase();
            if (contentTypeForSlug === "application") {
                contentTypeForSlug = "essay";
            }

            const successMessage = (
                <>
                    <p>
                        <span role="img" aria-label="happy face emoji">🙂</span>
                        Successfully saved {' '}
                        <Link to={`/${contentTypeForSlug}/${contentUsername}/${contentSlug}`}>
                            {content.title}
                        </Link>
                    </p>
                    {!savedContent.published && <small>Must be published to view</small>}
                </>
            );
            toastNotify(successMessage, 'info', { position: 'bottom-right' });
            navigate(`/${contentTypeForSlug}/${contentUsername}/${contentSlug}`);
        } catch (error) {
            console.error('Error saving content:', error);
            setContentPostError(getErrorMessage(error));
            toastNotify(getErrorMessage(error), 'error');
        } finally {
            setIsLoading('');
        }
    };

    const inviteContributor = () => {
        if (!invitedContributor) {
            toastNotify("Failed to invite contributor. Please select a user.", "error");
            return;
        }

        setIsLoadingContributorInvite("Inviting contributor...");
        ContentAPI
            .inviteContributor(content.id, invitedContributor.username)
            .then(res => {
                toastNotify(`${invitedContributor.first_name} has been sent an invite email.`);
                setInvitedContributor(null);
                if (res.data.blog) {
                    setContent(res.data.blog);
                } else if (res.data.essay) {
                    setContent(res.data.essay);
                }
            })
            .catch(err => {
                console.log({ err });
                const { response_message } = err.response.data;
                if (response_message) {
                    toastNotify(response_message, "error");
                } else {
                    toastNotify(`There was an error inviting ${invitedContributor.first_name}.\n\n 
                    Please message us using the chat icon in the bottom right of your screen.`, "error");
                }
            })
            .finally(() => {
                setIsLoadingContributorInvite(null);
            });
    };

    const removeContributor = (contributorUserProfile) => {
        setIsLoadingContributorInvite("Removing contributor...");
        ContentAPI
            .removeContributor(content.id, contributorUserProfile.username)
            .then(res => {
                toastNotify(`${contributorUserProfile.first_name} has been removed as a contributor.`);
                if (res.data.blog) {
                    setContent(res.data.blog);
                } else if (res.data.essay) {
                    setContent(res.data.essay);
                }
            })
            .catch(err => {
                console.log({ err });
                const { response_message } = err.response.data;
                if (response_message) {
                    toastNotify(response_message, "error");
                } else {
                    toastNotify(`There was an error removing ${contributorUserProfile.first_name}.\n\n 
                    Please message us using the chat icon in the bottom right of your screen.`, "error");
                }
            })
            .finally(() => {
                setIsLoadingContributorInvite(null);
            });
    };

    const elementTitle = isAddContentMode ? `Add ${contentType}` : `Edit ${contentType}`;
    const descriptionLabel = `Description: Write a short summary of what your ${contentType.toLowerCase()} post is about (400 characters max.).`;

    const { title, description, published, header_image_url, video_url, slides_url, body, essay_source_url, user, body_type } = content;

    if (!isAddContentMode && isLoading) {
        return (
            <div>
                <Loading title={isLoading} />
            </div>
        );
    }

    const contentActions = (
        <div className="col-12">
            {contentType === "Application" && (
                <div className="col-12 my-3">
                    <Popconfirm
                        placement="topRight"
                        title="This will overwrite your current essay. Are you sure?"
                        onConfirm={generateEssayFromResponses}
                    >
                        <Button type="primary">
                            Autogenerate essay using scholarship responses
                        </Button>
                    </Popconfirm>
                </div>
            )}
            <div className="col-12 my-3">
                <button type="submit" className="btn btn-primary center-block">
                    Save
                </button>
            </div>
            <div className="col-12">
                <button
                    type="button"
                    onClick={togglePublish}
                    className="btn btn-primary center-block"
                >
                    {published ? 'Unpublish' : 'Publish'}
                </button>
            </div>
        </div>
    );

    const isOwner = userProfile?.username === user?.username;

    const bodyTypeOptions = [
        { label: 'HTML', value: 'html' },
        { label: 'Markdown', value: 'markdown' },
    ];

    const inviteContributorModalBody = (
        <>
            <AutoCompleteRemoteData
                placeholder="Contributor's username or name..."
                onSelect={(userProfile) => setInvitedContributor(userProfile)}
                type="user"
            />
            {invitedContributor && (
                <div className="my-2">
                    Pending invite: <br />
                    <UserProfilePreview userProfile={invitedContributor} />
                    <MinusCircleOutlined
                        style={{ fontSize: "30px" }}
                        onClick={() => setInvitedContributor(null)}
                    />
                </div>
            )}
        </>
    );

    let authors = [];
    if (user && user.username) {
        authors.push(user);
    }
    if (selectedContributors) {
        authors.push(...selectedContributors);
    }

    const authorsReact = authors.map((userProfile, index) => (
        <div key={userProfile.username} className="bg-light my-3" style={{ display: 'inline-block', padding: '10px' }}>
            <UserProfilePreview userProfile={userProfile} linkProfile={true} />
            {isOwner && index !== 0 && (
                <Popconfirm
                    placement="topLeft"
                    title={`Confirm removing ${userProfile.first_name} as a contributor?`}
                    onConfirm={() => removeContributor(userProfile)}
                    okText="Yes"
                    cancelText="No"
                >
                    <CloseCircleOutlined />
                </Popconfirm>
            )}
        </div>
    ));

    return (
        <div className="mt-3">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{title && `${title} - `}{elementTitle} - Atila</title>
            </Helmet>
            {!userProfile && (
                <Alert message={`⚠️ Warning, you must be logged in to add or edit ${contentType}s`} />
            )}
            <Form
                form={form}
                layout="vertical"
                onFinish={submitForm}
                initialValues={{
                    body_type: 'html',
                    published: true
                }}
            >
                <TextareaAutosize
                    placeholder="Title"
                    className="border-0 center-block text-center col-12"
                    name="title"
                    value={title}
                    onChange={updateForm}
                    style={{ fontSize: '2.5rem' }}
                    maxLength="140"
                />
                {contentActions}
                <button
                    className="btn btn-link col-12 right"
                    type="button"
                    onClick={() => setShowContentAddOptions(!showContentAddOptions)}
                >
                    {showContentAddOptions && 'Hide'} Options
                </button>
                {slug && username && (
                    <Link to={`/${contentType.toLowerCase()}/${username}/${slug}`}>
                        View {contentType}
                    </Link>
                )}
                {!published && (
                    <p className="badge badge-secondary mx-1" style={{ fontSize: 'small' }}>
                        Unpublished
                    </p>
                )}
                {published && (
                    <p className="badge badge-primary mx-1" style={{ fontSize: 'small' }}>
                        Published
                    </p>
                )}
                {showContentAddOptions && (
                    <div className="col-12">
                        {/*
                            If there is already a description, the placeholder will be overwritten
                            so we include a <p> element
                            that allows the user to see the label in the absence of a placeholder.
                        */}
                        {description && (
                            <p className="text-muted">
                                {descriptionLabel}
                                {description.length > 300 && (
                                    <>
                                        <br />
                                        Character Count: {description.length} / {descriptionCharacterLengthMax}
                                    </>
                                )}
                            </p>
                        )}
                        <textarea
                            placeholder={descriptionLabel}
                            className="col-12 mb-3 form-control"
                            name="description"
                            value={description}
                            onChange={updateForm}
                        />

                        {contentType === 'Blog' && (
                            <>
                                <Radio.Group
                                    options={bodyTypeOptions}
                                    onChange={updateForm}
                                    name="body_type"
                                    value={body_type}
                                    optionType="button"
                                    buttonStyle="solid"
                                    className="col-12 mb-3"
                                />
                                <input
                                    type="url"
                                    name="header_image_url"
                                    placeholder={`Paste the url of a cover image for your ${contentType.toLowerCase()} post`}
                                    className="col-12 mb-3 form-control"
                                    onChange={updateForm}
                                    value={header_image_url}
                                />
                                <input
                                    type="url"
                                    name="video_url"
                                    placeholder={`Paste the url of a video for your ${contentType.toLowerCase()} post`}
                                    className="col-12 mb-3 form-control"
                                    onChange={updateForm}
                                    value={video_url}
                                />
                                <input
                                    type="url"
                                    name="slides_url"
                                    placeholder={`Paste the url of the slides for your ${contentType.toLowerCase()} post`}
                                    className="col-12 mb-3 form-control"
                                    onChange={updateForm}
                                    value={slides_url}
                                />

                                {isOwner && (
                                    <>
                                        <LinkContentToWallet content={content} contentType={contentType} />
                                        <ButtonModal
                                            showModalButtonSize="medium"
                                            showModalText="Invite Contributor..."
                                            modalTitle="Invite Contributor"
                                            modalBody={inviteContributorModalBody}
                                            submitText="Send Invite"
                                            onSubmit={inviteContributor}
                                            disabled={!!isLoadingContributorInvite}
                                        />
                                        <br />
                                        {isLoadingContributorInvite && (
                                            <div>
                                                <Loading title={isLoadingContributorInvite} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                        {contentType === 'Essay' && (
                            <input
                                type="url"
                                name="essay_source_url"
                                placeholder="Essay Source Url"
                                className="col-12 mb-3 form-control"
                                onChange={updateForm}
                                value={essay_source_url}
                            />
                        )}

                        {authorsReact}
                    </div>
                )}
                {header_image_url && (
                    <div className="col-12 text-center">
                        <img src={header_image_url} alt={title} className="header-image" />
                    </div>
                )}
                {body_type === "markdown" ? (
                    <div className="mw-100 text-left">
                        <textarea
                            className="col-12 mb-3 form-control"
                            name="body"
                            value={body}
                            onChange={updateForm}
                            rows={12}
                        />
                        <ContentBody body={body} bodyType={body_type} className="mw-100" />
                    </div>
                ) : (
                    <CKEditor
                        editor={InlineEditor}
                        data={body}
                        onChange={editorChange}
                        config={FormInputConstants.editorConfig}
                    />
                )}
                {contentPostError && (
                    <pre className="text-danger" style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(contentPostError, null, 4)}
                    </pre>
                )}
                {contentActions}
            </Form>
        </div>
    );
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
    userProfile: PropTypes.shape({}),
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default connect(mapStateToProps)(ContentAddEdit);