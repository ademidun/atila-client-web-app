import React, { useEffect } from "react";
import EbookLandingBanner from "./EbookLandingBanner";
import HelmetSeo from "../../components/HelmetSeo";
import EmailSignUp from "./EmailSignUp";
import EbookInterviews from "./EbookInterview/EbookInterview";
import TableauGraphsEmbed from "./TableauGraphsEmbed";
import EbookVideoEmbed from "./EbookVideoEmbed";
import PremiumDescription from "./PremiumDescription";
import EbookPreview from "./EbookPreview";
import {BackTop} from "antd";
import {scrollToElement, unSlugify} from "../../services/utils";
import {EBOOK_AUDIENCE_IMAGES} from "../../models/Constants";
import EbookFAQ from "./EbookFAQ";
import EbookChapter from './EbookChapter';
import { useScript } from "../../services/utils/HookUtils";

function Ebook(props) {

    useScript("https://gumroad.com/js/gumroad.js");

    const {location: {search}} = props;
    const params = new URLSearchParams(search);
    let audience = unSlugify(params.get('audience') || '1');

    if (EBOOK_AUDIENCE_IMAGES[audience]===undefined) {
        audience = '1';
    }

    useEffect(() => {

        if (props?.location?.hash) {
            setTimeout(() => {
                scrollToElement(props.location.hash);
            }, 500);
        }
    }, [props?.location?.hash]);

    const seoContent = {
        title:
            "Atila Schools and Jobs Guide | The Best Canadian Universities for the Best Jobs",
        description:
            "A guide to the best Canadian universities for getting jobs at Goldman Sachs, Google, McKinsey, Pfizer and more.",
        image: EBOOK_AUDIENCE_IMAGES[audience].seoImage,
        slug: "/schools",
    };

    return (
        <React.Fragment>
            <div>
                <HelmetSeo content={seoContent}/>
                <BackTop/>
                <EbookLandingBanner audience={audience} />
                <hr/>
                <EmailSignUp audience={audience} />
                <hr/>
                <EbookPreview/>
                <hr/>
                <EbookChapter />
                <hr/>
                <TableauGraphsEmbed/>
                <hr/>
                <EbookInterviews/>
                <hr/>
                <EbookFAQ />
                <hr/>
                <PremiumDescription/>
                <hr/>
                <EbookVideoEmbed/>
                <hr/>
            </div>
        </React.Fragment>
    );
}

export default Ebook;
