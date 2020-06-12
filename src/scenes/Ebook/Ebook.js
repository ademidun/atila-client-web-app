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
        <EbookVideoEmbed />
        <hr />
      </div>
    </React.Fragment>
  );
}

export default Ebook;
