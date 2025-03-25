import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import {
    createTableOfContents,
    addStyleClasstoTables,
    openAllLinksInNewTab,
    makeImagesCards
} from '../../../services/utils';

export const CONTENT_BODY_CLASS_NAME = 'content-body';

function ContentBody({ body, bodyType = 'html' }) {
    useEffect(() => {
        createTableOfContents(`.${CONTENT_BODY_CLASS_NAME}`);
        addStyleClasstoTables(`.${CONTENT_BODY_CLASS_NAME}`);
        openAllLinksInNewTab(`.${CONTENT_BODY_CLASS_NAME}`);
        makeImagesCards(`.${CONTENT_BODY_CLASS_NAME}`);
    }, [body]);

    if (!body) {
        return null;
    }

    if (bodyType === 'markdown') {
        return (
            <div className={CONTENT_BODY_CLASS_NAME}>
                <ReactMarkdown>{body}</ReactMarkdown>
            </div>
        );
    }

    return (
        <div
            className={CONTENT_BODY_CLASS_NAME}
            dangerouslySetInnerHTML={{ __html: body }}
        />
    );
}

ContentBody.propTypes = {
    body: PropTypes.string,
    bodyType: PropTypes.oneOf(['html', 'markdown'])
};

export default ContentBody; 