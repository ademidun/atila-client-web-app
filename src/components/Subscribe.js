import React from "react";
import HelmetSeo from "./HelmetSeo";

function Subscribe() {

    const newsletterDescription = 'This form form notifies subscribers of new scholarships.';
    const seoContent = {
        title: 'Subscribe to our Scholarship Newsletter',
        description: newsletterDescription,
        image: '',
        slug: '/subscribe'
    };

    return (
        <div className="container m-3">
            <HelmetSeo content={seoContent} />
            <div className="card p-3">
                <h1>The Atila Scholarship Newsletter</h1>
                <div className="center-block mb-3 px-md-5">
                    {newsletterDescription}
                </div>

                <div className="center-block mb-3">
                    <iframe class="airtable-embed"
                        src="https://airtable.com/embed/shrgszV8oKhg0nbHr"
                        width="720" height="405" frameBorder="0" title="Scholarship Newsletter Airtable Form" />
                </div>

            </div>
        </div>

    );
}

export default Subscribe;