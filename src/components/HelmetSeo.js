import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export const defaultSeoContent = {
    title: 'Atila - Find and Apply for Scholarships',
    description: 'Find and apply for scholarships, read student essays and blogs.',
    image: 'https://i.imgur.com/PMg68If.png',
    slug: '/'
};

function HelmetSeo({ content }) {
    if (!content) {
        return null;
    }

    const {
        title,
        description,
        header_image_url,
        user,
        created,
        updated,
    } = content;

    const author = user?.first_name && user?.last_name
        ? `${user.first_name} ${user.last_name}`
        : user?.username;

    const url = `${window.location.origin}${window.location.pathname}`;
    const datePublished = new Date(created || new Date()).toISOString();
    const dateModified = new Date(updated || created) || new Date().toISOString();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        image: header_image_url,
        author: {
            '@type': 'Person',
            name: author
        },
        publisher: {
            '@type': 'Organization',
            name: 'Atila',
            logo: {
                '@type': 'ImageObject',
                url: `${window.location.origin}/logo192.png`
            }
        },
        datePublished,
        dateModified,
        url
    };

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="article" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {header_image_url && <meta property="og:image" content={header_image_url} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {header_image_url && <meta name="twitter:image" content={header_image_url} />}

            {/* Article specific metadata */}
            {author && <meta name="author" content={author} />}
            {created && <meta name="article:published_time" content={datePublished} />}
            {updated && <meta name="article:modified_time" content={dateModified} />}

            {/* JSON-LD structured data */}
            <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>
        </Helmet>
    );
}

HelmetSeo.propTypes = {
    content: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        header_image_url: PropTypes.string,
        user: PropTypes.shape({
            first_name: PropTypes.string,
            last_name: PropTypes.string,
            username: PropTypes.string
        }),
        created: PropTypes.string,
        updated: PropTypes.string,
        slug: PropTypes.string
    })
};

export default HelmetSeo;