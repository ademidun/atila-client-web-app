import React from "react";
import EbookLandingBanner from "./EbookLandingBanner";
import HelmetSeo from "../../components/HelmetSeo";
import EmailSignUp from "./EmailSignUp";
import EbookInterviews from "./EbookInterview/EbookInterview";
import TableauGraphsEmbed from "./TableauGraphsEmbed";
import EbookVideoEmbed from "./EbookVideoEmbed";
import PremiumDescription from "./PremiumDescription";
import EbookPreview from "./EbookPreview";
import {BackTop} from "antd";
import {unSlugify} from "../../services/utils";
import {EBOOK_AUDIENCE_IMAGES} from "../../models/Constants";
import EbookFAQ from "./EbookFAQ";

class Ebook extends React.Component {

    constructor(props) {
        super(props);
        const {location: {search}} = props;
        const params = new URLSearchParams(search);
        let audience = unSlugify(params.get('audience') || '1');
        console.log({search, audience});
        console.log("EBOOK_AUDIENCE_IMAGES[audience]", EBOOK_AUDIENCE_IMAGES[audience]);

        if (EBOOK_AUDIENCE_IMAGES[audience]===undefined) {
            audience = '1';
        }

        this.state = {
            audience,
        }

    }


    render() {

        const {audience} = this.state;
        console.log({audience});

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
                    <EbookPreview/>
                    <hr/>
                    <EbookFAQ />
                    <hr/>
                    <EmailSignUp audience={audience} />
                    <hr/>
                    <TableauGraphsEmbed/>
                    <hr/>
                    <PremiumDescription/>
                    <hr/>
                    <EbookVideoEmbed/>
                    <hr/>
                    <EbookInterviews/>
                    <hr/>
                </div>
            </React.Fragment>
        );
    }
}

export default Ebook;
