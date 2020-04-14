import React from "react";
import EbookLandingBanner from "./EbookLandingBanner";
import HelmetSeo from "../../components/HelmetSeo";
import EmailSignUp from "./EmailSignUp";
import Team from "../../components/Team/Team";
import EbookInterviews from "./EbookInterview/EbookInterview";
import TableauGraphsEmbed from "./TableauGraphsEmbed";
import EbookDescription from "./EbookDescription";
import EbookChapter from "./EbookChapter";
import EbookVideoEmbed from "./EbookVideoEmbed";

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
        <EbookLandingBanner />
        <hr />
        <EmailSignUp />
        <hr />
        <EbookDescription />
        <hr />
        <EbookChapter />
        <hr />
        <TableauGraphsEmbed />
        <hr />
        <EbookInterviews />
        <hr />
        <Team
          showArray={["Tomiwa", "Melissa", "Isaac", "Elaine", "Aaron", "Dev"]}
          showLinkedin={false}
          showSeo={false}
        />

        <hr />
        <EbookVideoEmbed />
      </div>
    </React.Fragment>
  );
}

export default Ebook;
