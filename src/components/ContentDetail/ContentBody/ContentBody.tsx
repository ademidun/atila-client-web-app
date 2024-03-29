import React from 'react'
import ReactMarkdown from 'react-markdown';
import "./ContentBody.scss";

interface ContentBodyPropTypes {
    /** Amount to send to destination address before gas fees. */
    body: string;
    bodyType: string;
    className: string;
}

ContentBody.defaultProps = {
    body: "",
    bodyType: "html",
    className: "",
}


export const CONTENT_BODY_CLASS_NAME = "ContentBody";

function ContentBody(props: ContentBodyPropTypes) {

    const { body, bodyType, className } = props;
    let bodyContent;
    if (bodyType === "markdown") {
        bodyContent = (
            <div className={`${CONTENT_BODY_CLASS_NAME} ${bodyType} ${className}`}>
                <ReactMarkdown children={body} />
            </div>
            
        )
    } else {
        bodyContent = (
            // TODO find a way to secure against XSS: https://stackoverflow.com/a/19277723*/                    
            <div className={`${CONTENT_BODY_CLASS_NAME} ${bodyType}`}
                dangerouslySetInnerHTML={{__html: body}} />
                );
    }
    return (
        <>
        {bodyContent}
        </>
    )
}

export default ContentBody
