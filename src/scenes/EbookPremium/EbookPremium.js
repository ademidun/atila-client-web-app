import React from "react";
import HelmetSeo from "../../components/HelmetSeo";
import EbookPremiumBanner from "./EbookPremiumBanner";

function Ebook() {
    const seoContent = {
        title:
            "Atila Schools and Jobs Guide | The Best Canadian Universities for the Best Jobs",
        description:
            "A guide to The best Canadian Universities for getting jobs at Goldman Sachs, Google, McKinsey, Pfizer and more.",
        image: "https://i.imgur.com/Lhxyq0T.png",
        slug: "/schools",
    };

    return (
        <React.Fragment>
            <HelmetSeo content={seoContent} />
            <div>
                <h1 className='col-sm-12 text-center mt-md-5 mb-md-2'>
                    Atila Schools and Jobs Guide Premium Section
                </h1>
                <h6 className='col-sm-12 text-center d-sm-block d-md-none'>
                    (Works best on desktop)
                </h6>
                <h6 className='col-sm-12 text-center'>
                    (New graphs added weekly)
                </h6>
                <EbookPremiumBanner />
                <hr />
            </div>
        </React.Fragment>
    );
}

export default Ebook;
