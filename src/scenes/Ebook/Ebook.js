import React, { Component } from "react";
import EbookLandingBanner from "./EbookLandingBanner";
import HelmetSeo from "../../components/HelmetSeo";
import EmailSignUp from "./EmailSignUp";
import Team from "../../components/Team/Team";
import EbookInterviews from "./EbookInterview/EbookInterview";
import TableauGraphsEmbed from "./TableauGraphsEmbed";
import EbookVideoEmbed from "./EbookVideoEmbed";
import PremiumDescription from "./PremiumDescription";
import EbookPreview from "./EbookPreview";
import { withRouter } from "react-router";
import { BackTop } from "antd";
import queryString from "query-string";

class Ebook extends Component {
  render() {
    const seoContent = {
      title:
        "Atila Schools and Jobs Guide | The Best Canadian Universities for the Best Jobs",
      description:
        "A guide to The best Canadian Universities for getting jobs at Goldman Sachs, Google, McKinsey, Pfizer and more.",
      image: "https://i.imgur.com/Lhxyq0T.png",
      slug: "/schools",
    };

    const audience = queryString.parse(this.props.location.search).audience;

    return (
      <React.Fragment>
        <div>
          <HelmetSeo content={seoContent} />
          <BackTop />
          <EbookLandingBanner audience={audience} />
          <hr />
          <EmailSignUp audience={audience} />
          <hr />
          <EbookPreview audience={audience} />
          <hr />
          <TableauGraphsEmbed />
          <hr />
          <PremiumDescription audience={audience} />
          <hr />
          <EbookInterviews />
          <hr />
          <Team
            showArray={[
              "Tomiwa",
              "Melissa",
              "Isaac",
              "Elaine",
              "Aaron",
              "Dev",
              "Hadi",
              "Grace",
              "Emily",
            ]}
            showLinkedin={false}
            showSeo={false}
          />
          <hr />
          <EbookVideoEmbed audience={audience} />
          <hr />
          <EbookLandingBanner audience={audience} />
          <hr />
          <EmailSignUp audience={audience} />
          <hr />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Ebook);
