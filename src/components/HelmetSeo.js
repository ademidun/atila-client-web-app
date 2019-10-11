import {Helmet} from "react-helmet";
import React from "react";
import {genericItemTransform} from "../services/utils";

const defaultContent = {
    title: 'Atila - Increase your chances of getting more money for school. Easily find and apply to scholarships.',
    description: 'Increase your chances of getting more money for school. Easily find and apply to scholarships.',
    img: 'https://firebasestorage.googleapis.com/' +
        'v0/b/atila-7.appspot.com/o/public%2Fatila-landing-page-october-11-2019.png' +
        '?alt=media&token=f0cc7224-86f7-4365-9ff1-b53034ada0ad',
    slug: ''
};

function HelmetSeo({content = defaultContent}) {

    const data = genericItemTransform(content);

    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>{data.title} - Atila</title>
            <meta property="og:title" content={data.title} />
            <meta name="Description" content={data.description} />

            <meta property="og:url" content={`https://atila.ca/${data.slug}`} />
            <meta property="og:type" content={data.type} />
            <meta property="og:description" content={data.description} />
            <meta property="og:image" content={data.img} />

            <meta itemProp="name" content={data.title} />
            <meta itemProp="description" content={data.description} />
            <meta itemProp="image" content={data.img} />
            <meta property="og:type" content="article" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@atilatech" />
            <meta name="twitter:title" content={data.title} />
            <meta name="twitter:description" content={data.description} />
            <meta name="twitter:image" content={data.img} />
        </Helmet>

    )
}

export default HelmetSeo;