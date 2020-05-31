import React from "react";
import EbookLandingBanner from "./EbookLandingBanner";
import HelmetSeo from "../../components/HelmetSeo";
import EmailSignUp from "./EmailSignUp";
import Team from "../../components/Team/Team";
import EbookInterviews from "./EbookInterview/EbookInterview";
import TableauGraphsEmbed from "./TableauGraphsEmbed";
import EbookVideoEmbed from "./EbookVideoEmbed";
import PremiumDescription from "./PremiumDescription";
import EbookPreview from "./EbookPreview";
import {BackTop} from "antd";
import {unSlugify} from "../../services/utils";
import {EBOOK_AUDIENCE_IMAGES} from "../../models/Constants";

class Ebook extends React.Component {

    constructor(props){
        super(props);
        const {location: { search }} = props;
        const params = new URLSearchParams(search);
        const audience = unSlugify(params.get('audience') || '1');
        console.log({search, audience});

        this.state = {
            audience,
        }

    }


    render() {

        const { audience } = this.state;
        console.log({audience});

        const seoContent = {
            title:
                "Atila Schools and Jobs Guide | The Best Canadian Universities for the Best Jobs",
            description:
                "A guide to The best Canadian Universities for getting jobs at Goldman Sachs, Google, McKinsey, Pfizer and more.",
            image: EBOOK_AUDIENCE_IMAGES[audience].seoImage,
            slug: "/schools",
        };


        return (
            <React.Fragment>
                <div>
                    <HelmetSeo content={seoContent} />
                    <BackTop />
                    <EbookLandingBanner audience={audience} />
                    <hr />
                    <EmailSignUp />
                    <hr />
                    <EbookPreview />
                    <hr />
                    <TableauGraphsEmbed />
                    <hr />
                    <PremiumDescription />
                    <hr />
                    <EbookInterviews />
                    <hr />
                    <Team
                        showArray={["Tomiwa", "Melissa", "Isaac", "Elaine", "Aaron", "Dev", "Hadi", "Grace", "Emily"]}
                        showLinkedin={false}
                        showSeo={false}
                    />
                    <hr />
                    <EbookVideoEmbed />
                    <hr />
                    <EbookLandingBanner />
                    <hr />
                    <EmailSignUp />
                    <hr />
                </div>
            </React.Fragment>
        );
    }
}

export default Ebook;
