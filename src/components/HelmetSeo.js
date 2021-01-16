import {Helmet} from "react-helmet";
import PropTypes from 'prop-types';
import React from "react";
import $ from 'jquery';

export const defaultSeoContent = {
    title: 'Atila - The easiest way to start and get scholarships.',
    description: 'The easiest way to start and get scholarships.',
    image: 'https://i.imgur.com/nib7LyD.png',
    slug: ''
};

function HelmetSeo({content}) {

    try {
        if (process.env.NODE_ENV !=='test' && $) {
            $('meta[property="og:url"]').attr('content', window.location.href);
            $('meta[property="og:type"]').attr('content', content.type);
            $('meta[property="og:description"]').attr('content', content.description);
            $('meta[property="og:image"]').attr('content', content.image);


            $('meta[itemprop="name"]').attr('content', content.title);
            $('meta[itemprop="description"]').attr('content', content.description);
            $('meta[itemprop="image"]').attr('content', content.image);

            $('meta[name="twitter:title"]').attr('content', content.title);
            $('meta[name="twitter:description"]').attr('content', content.description);
            $('meta[name="twitter:image"]').attr('content', content.image);

        }
    }
    catch (e) {
        console.warn({e});
    }

    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>{content.title} - Atila</title>
            <meta name="Description" content={content.description} />

            <meta property="og:title" content={content.title} />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:type" content={content.type} />
            <meta property="og:description" content={content.description} />
            <meta property="og:image" content={content.image} />

            <meta itemProp="name" content={content.title} />
            <meta itemProp="description" content={content.description} />
            <meta itemProp="image" content={content.image} />
            <meta property="og:type" content="article" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@atilatech" />
            <meta name="twitter:title" content={content.title} />
            <meta name="twitter:description" content={content.description} />
            <meta name="twitter:image" content={content.image} />

        </Helmet>

    )
}

HelmetSeo.propTypes = {
    content: PropTypes.shape({}).isRequired,
};

export default HelmetSeo;