import React from "react";
import EbookLandingBanner from "./EbookLandingBanner";
import HelmetSeo from "../../components/HelmetSeo";
import EmailSignUp from "./EmailSignUp";
import TableauGraphsEmbed from "./TableauGraphsEmbed";

function Ebook() {
  const seoContent = {
    title:
      "Atila Schools and Jobs Report | The Best Canadian Universities for the Best Jobs",
    description:
      "The best Canadian Universities for getting jobs at Goldman Sachs, Google, McKinsey, Pfizer and more.",
    image: "https://i.imgur.com/cmpakw1.png",
    slug: "/schools",
  };

  return (
    <React.Fragment>
      <div>
        <HelmetSeo content={seoContent} />
        <EbookLandingBanner />
        <hr/>
        <EmailSignUp />
        <hr/>
        <TableauGraphsEmbed/>
      </div>
    </React.Fragment>
  );
}

export default Ebook;
