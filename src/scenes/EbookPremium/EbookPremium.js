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
            <div>
                <HelmetSeo content={seoContent} />
                <EbookPremiumBanner />
                <hr />
            </div>
        </React.Fragment>
    );
}

export default Ebook;
