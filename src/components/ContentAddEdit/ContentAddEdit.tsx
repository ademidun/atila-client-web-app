import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import CKEditor from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import { Helmet } from "react-helmet";
import { Alert, Button, Popconfirm, Radio, Form } from 'antd';
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';
import { connect } from "react-redux";
import { getErrorMessage, slugify } from "../../services/utils";
import { toastNotify } from "../../models/Utils";
import Loading from "../Loading";
import ApplicationsAPI from '../../services/ApplicationsAPI';
import AutoCompleteRemoteData from "../AutoCompleteRemoteData";
import { UserProfilePreview } from "../ReferredByInput";
import { MinusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ButtonModal from "../ButtonModal";
import FormInputConstants from '../../models/FormInputConstants';
import LinkContentToWallet from '../Crypto/LinkContentToWallet';
import ContentBody from '../ContentDetail/ContentBody/ContentBody';
import BlogsApi from '../../services/BlogsAPI';
import EssaysApi from '../../services/EssaysAPI';
import './ContentAddEdit.scss';

interface UserProfile {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
}

interface Content {
    id?: string;
    title: string;
    slug: string;
    description: string;
    body: string;
    body_type: 'html' | 'markdown';
    essay_source_url?: string;
    header_image_url: string;
    video_url: string;
    slides_url: string;
    published: boolean;
    contributors: UserProfile[];
    user?: UserProfile;
    scholarship_responses?: Record<string, any>;
}

interface ContentAddEditProps {
    contentType: 'essay' | 'blog' | 'application';
    userProfile: UserProfile | null;
}

const defaultContent: Content = {
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

function ContentAddEdit({ contentType, userProfile }: ContentAddEditProps) {
    const location = useLocation();
    const { slug, username } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    const [content, setContent] = useState<Content>(defaultContent);
    const [contentPostError, setContentPostError] = useState<any>(null);
    const [contentGetError, setContentGetError] = useState<any>(null);
    const [isAddContentMode, setIsAddContentMode] = useState(false);
    const [showContentAddOptions, setShowContentAddOptions] = useState(true);
    const [isLoading, setIsLoading] = useState<string | null>(`Loading ${contentType}`);
    const [isLoadingContributorInvite, setIsLoadingContributorInvite] = useState<string | null>(null);
    const [invitedContributor, setInvitedContributor] = useState<UserProfile | null>(null);
    const [selectedContributors, setSelectedContributors] = useState<UserProfile[]>([]);

    const ContentAPI = contentType === 'blog' ? BlogsApi : EssaysApi;

    const loadContent = useCallback(async () => {
        setIsLoading('Loading content...');
        try {
            const response = await ContentAPI.getSlug(slug);
            const content = response.data.blog || response.data.essay || response.data.application;
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
                contributors: content.contributors?.map((c: UserProfile) => c.username) || []
            });
            if (content.contributors) {
                setSelectedContributors(content.contributors);
            }
        } catch (error) {
            console.error('Error loading content:', error);
            setContentGetError(getErrorMessage(error));
        } finally {
            setIsLoading(null);
        }
    }, [ContentAPI, form, slug]);

    useEffect(() => {
        if (location.pathname === `/${contentType}/add`) {
            setIsAddContentMode(true);
            setIsLoading(null);
            if (userProfile) {
                setContent(prev => ({ ...prev, user: userProfile }));
            } else {
                toastNotify(`⚠️ Warning, you must be logged in to add ${contentType}s`);
            }
        } else {
            loadContent();
        }
    }, [contentType, location.pathname, userProfile, loadContent]);

    const updateForm = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
        if (!event || !event.target) {
            // Handle Radio.Group onChange which passes value directly
            return;
        }
        
        const { name, value } = event.target;
        
        if (name === 'title') {
            setContent(prev => ({ ...prev, slug: slugify(value), [name]: value }));
        } else if (name === 'description' && value.length >= descriptionCharacterLengthMax) {
            setContent(prev => ({ 
                ...prev, 
                [name]: value.substring(0, descriptionCharacterLengthMax) 
            }));
        } else {
            setContent(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRadioChange = (e: any) => {
        setContent(prev => ({ ...prev, body_type: e.target.value }));
    };

    const togglePublish = async (event: React.MouseEvent) => {
        event.preventDefault();
        setContent(prev => ({ ...prev, published: !prev.published }));
        await submitForm();
    };

    const editorChange = (event: any, editor: any) => {
        const data = editor.getData();
        setContent(prev => ({ ...prev, body: data }));
    };

    const generateEssayFromResponses = async () => {
        if (!content.id) return;
        
        setIsLoading("Autogenerating essay using your scholarship response");
        try {
            const res = await ApplicationsAPI.convertApplicationToEssay(
                content.id, 
                Object.keys(content.scholarship_responses || {}), 
                content.published
            );
            const { description, body } = res.data.application;
            setContent(prev => ({ ...prev, body, description }));
        } catch (err) {
            setContentGetError(err);
        } finally {
            setIsLoading(null);
        }
    };

    const submitForm = async (event?: React.FormEvent) => {
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

            const response = await (isAddContentMode ? 
                ContentAPI.create(contentData) : 
                ContentAPI.update(content.id, contentData)
            );

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
            setIsLoading(null);
        }
    };

    const inviteContributor = async () => {
        if (!invitedContributor || !content.id) {
            toastNotify("Failed to invite contributor. Please select a user.", "error");
            return;
        }

        setIsLoadingContributorInvite("Inviting contributor...");
        try {
            // Use @ts-ignore to bypass TypeScript check since we know these methods exist at runtime
            // @ts-ignore
            const res = await ContentAPI.inviteContributor(content.id, invitedContributor.username);
            toastNotify(`${invitedContributor.first_name} has been sent an invite email.`);
            setInvitedContributor(null);
            if (res.data.blog) {
                setContent(res.data.blog);
            } else if (res.data.essay) {
                setContent(res.data.essay);
            }
        } catch (err: any) {
            console.error({ err });
            const response_message = err.response?.data?.response_message;
            if (response_message) {
                toastNotify(response_message, "error");
            } else {
                toastNotify(
                    `There was an error inviting ${invitedContributor.first_name}.\n\n 
                    Please message us using the chat icon in the bottom right of your screen.`, 
                    "error"
                );
            }
        } finally {
            setIsLoadingContributorInvite(null);
        }
    };

    const removeContributor = async (contributorUserProfile: UserProfile) => {
        if (!content.id) return;

        setIsLoadingContributorInvite("Removing contributor...");
        try {
            // Use @ts-ignore to bypass TypeScript check since we know these methods exist at runtime
            // @ts-ignore
            const res = await ContentAPI.removeContributor(content.id, contributorUserProfile.username);
            toastNotify(`${contributorUserProfile.first_name} has been removed as a contributor.`);
            if (res.data.blog) {
                setContent(res.data.blog);
            } else if (res.data.essay) {
                setContent(res.data.essay);
            }
        } catch (err: any) {
            console.error({ err });
            const response_message = err.response?.data?.response_message;
            if (response_message) {
                toastNotify(response_message, "error");
            } else {
                toastNotify(
                    `There was an error removing ${contributorUserProfile.first_name}.\n\n 
                    Please message us using the chat icon in the bottom right of your screen.`, 
                    "error"
                );
            }
        } finally {
            setIsLoadingContributorInvite(null);
        }
    };

    if (!isAddContentMode && isLoading) {
        return <Loading title={isLoading} />;
    }

    const elementTitle = isAddContentMode ? `Add ${contentType}` : `Edit ${contentType}`;
    const descriptionLabel = `Description: Write a short summary of what your ${contentType} post is about (${descriptionCharacterLengthMax} characters max.).`;
    const isOwner = userProfile?.username === content.user?.username;

    const bodyTypeOptions = [
        { label: 'HTML', value: 'html' },
        { label: 'Markdown', value: 'markdown' },
    ];

    const inviteContributorModalBody = (
        <>
            {/* @ts-ignore - Component has correct props at runtime */}
            <AutoCompleteRemoteData
                placeholder="Contributor's username or name..."
                onSelect={(userProfile: UserProfile) => setInvitedContributor(userProfile)}
                type="user"
            />
            {invitedContributor && (
                <div className="my-2">
                    Pending invite: <br />
                    <UserProfilePreview userProfile={invitedContributor} />
                    {/* @ts-ignore - Component has correct props at runtime */}
                    <MinusCircleOutlined
                        style={{ fontSize: "30px" }}
                        onClick={() => setInvitedContributor(null)}
                    />
                </div>
            )}
        </>
    );

    const authors = [
        ...(content.user ? [content.user] : []),
        ...selectedContributors
    ];

    const contentActions = (
        <div className="col-12">
            {contentType === "application" && (
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
                    {content.published ? 'Unpublish' : 'Publish'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="mt-3">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{content.title && `${content.title} - `}{elementTitle} - Atila</title>
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
                    value={content.title}
                    onChange={(e: any) => updateForm(e)}
                    style={{ fontSize: '2.5rem' }}
                    maxLength={140}
                />
                {contentActions}
                <button
                    className="btn btn-link col-12 right"
                    type="button"
                    onClick={() => setShowContentAddOptions(!showContentAddOptions)}
                >
                    {showContentAddOptions && 'Hide'} Options
                </button>
                {content.slug && username && (
                    <Link to={`/${contentType}/${username}/${content.slug}`}>
                        View {contentType}
                    </Link>
                )}
                {!content.published && (
                    <p className="badge badge-secondary mx-1" style={{ fontSize: 'small' }}>
                        Unpublished
                    </p>
                )}
                {content.published && (
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
                        {content.description && (
                            <p className="text-muted">
                                {descriptionLabel}
                                {content.description.length > 300 && (
                                    <>
                                        <br />
                                        Character Count: {content.description.length} / {descriptionCharacterLengthMax}
                                    </>
                                )}
                            </p>
                        )}
                        <textarea
                            placeholder={descriptionLabel}
                            className="col-12 mb-3 form-control"
                            name="description"
                            value={content.description}
                            onChange={updateForm}
                        />

                        {contentType === 'blog' && (
                            <>
                                <Radio.Group
                                    options={bodyTypeOptions}
                                    onChange={handleRadioChange}
                                    name="body_type"
                                    value={content.body_type}
                                    optionType="button"
                                    buttonStyle="solid"
                                    className="col-12 mb-3"
                                />
                                <input
                                    type="url"
                                    name="header_image_url"
                                    placeholder={`Paste the url of a cover image for your ${contentType} post`}
                                    className="col-12 mb-3 form-control"
                                    onChange={updateForm}
                                    value={content.header_image_url}
                                />
                                <input
                                    type="url"
                                    name="video_url"
                                    placeholder={`Paste the url of a video for your ${contentType} post`}
                                    className="col-12 mb-3 form-control"
                                    onChange={updateForm}
                                    value={content.video_url}
                                />
                                <input
                                    type="url"
                                    name="slides_url"
                                    placeholder={`Paste the url of the slides for your ${contentType} post`}
                                    className="col-12 mb-3 form-control"
                                    onChange={updateForm}
                                    value={content.slides_url}
                                />

                                {isOwner && (
                                    <>
                                        {/* @ts-ignore - Component has correct props at runtime */}
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
                                            <Loading title={isLoadingContributorInvite} />
                                        )}
                                    </>
                                )}
                            </>
                        )}
                        {contentType === 'essay' && (
                            <input
                                type="url"
                                name="essay_source_url"
                                placeholder="Essay Source Url"
                                className="col-12 mb-3 form-control"
                                onChange={updateForm}
                                value={content.essay_source_url}
                            />
                        )}

                        {authors.map((userProfile, index) => (
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
                                        {/* @ts-ignore - Component has correct props at runtime */}
                                        <CloseCircleOutlined />
                                    </Popconfirm>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {content.header_image_url && (
                    <div className="col-12 text-center">
                        <img src={content.header_image_url} alt={content.title} className="header-image" />
                    </div>
                )}
                {content.body_type === "markdown" ? (
                    <div className="mw-100 text-left">
                        <textarea
                            className="col-12 mb-3 form-control"
                            name="body"
                            value={content.body}
                            onChange={updateForm}
                            rows={12}
                        />
                        <ContentBody body={content.body} bodyType={content.body_type} className="mw-100" />
                    </div>
                ) : (
                    <CKEditor
                        editor={InlineEditor}
                        data={content.body}
                        onChange={editorChange}
                        config={FormInputConstants.editorConfig}
                    />
                )}
                {contentPostError && (
                    <pre className="text-danger" style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(contentPostError, null, 4)}
                    </pre>
                )}
                {contentGetError && (
                    <pre className="text-danger" style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(contentGetError, null, 4)}
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

const mapStateToProps = (state: any) => ({
    userProfile: state.data.user.loggedInUserProfile
});

export default connect(mapStateToProps)(ContentAddEdit);