import React from "react";
import EbookLandingBanner from "./EbookLandingBanner";
import HelmetSeo from "../../components/HelmetSeo";
import EmailSignUp from "./EmailSignUp";

function Ebook() {
  const seoContent = {
    title:
      "Atila Schools and Jobs Report | The Best Canadian Universities for the Best Jobs",
    description:
      "The best Canadian Universities for getting jobs at Goldman Sachs, Google, McKinsey, Pfizer and more.",
    image: "https://i.imgur.com/fejhJZT.png",
    slug: "/schools",
  };

  return (
    <React.Fragment>
      <div
        style={{
          backgroundColor: "#add8e6",
          backgroundImage: "linear-gradient(-90deg, red, orange)",
        }}
      >
        <HelmetSeo content={seoContent} />
        <EbookLandingBanner />

        <EmailSignUp />
      </div>
    </React.Fragment>
  );
}

export default Ebook;
