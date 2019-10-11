import {Helmet} from "react-helmet";
import React from "react";
import {genericItemTransform} from "../services/utils";

const defaultContent = {
    title: 'Atila - Increase your chances of getting more money for school. Easily find and apply to scholarships.',
    description: 'Increase your chances of getting more money for school. Easily find and apply to scholarships.',
    image: 'https://firebasestorage.googleapis.com/' +
        'v0/b/atila-7.appspot.com/o/public%2Fatila-landing-page-october-11-2019.png' +
        '?alt=media&token=f0cc7224-86f7-4365-9ff1-b53034ada0ad',
    slug: ''
};

function HelmetSeo({content = defaultContent}) {

    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>{content.title} - Atila</title>
            <meta property="og:title" content={content.title} />
            <meta name="Description" content={content.description} />

            <meta property="og:url" content={`https://atila.ca/${content.slug}`} />
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

export default HelmetSeo;