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
        <BackTop />
        <EbookLandingBanner />
        <hr />
        <EbookPreview />
        <hr />
        <TableauGraphsEmbed />
        <hr />
        <EmailSignUp />
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

export default Ebook;
