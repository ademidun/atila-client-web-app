import React from 'react';
import EbookLandingBanner from "./EbookLandingBanner";
import HelmetSeo from "../../components/HelmetSeo";

function Ebook() {

    const seoContent = {
        title: 'Atila Schools and Jobs Report | The Best Canadian Universities for the Best Jobs',
        description: 'The best Canadian Universities for getting jobs at Goldman Sachs, Google, McKinsey, Pfizer and more.',
        image: 'https://i.imgur.com/pDvsRnZ.png',
        slug: '/schools'
    };

    return (
        <React.Fragment>

            <HelmetSeo content={seoContent} />
            <EbookLandingBanner/>
        </React.Fragment>
    );
}

export default Ebook;