import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

import ContentCard from "../../components/ContentCard";
import ScholarshipCard from "../Scholarship/ScholarshipCard";

function LandingPageContent({ title, description, contentList, contentType, link }) {

    if (!contentList) {
        return null;
    }
    let contentListDisplay = contentList.map( content => (<ContentCard className="max-width-md-30 m-2"
                                                                         key={content.slug}
                                                                         content={content}/>));

    if (contentType === 'scholarship') {
        let className =  "max-width-md-30";

        contentListDisplay = contentList.map( content => (<ScholarshipCard key={content.slug}
                                                                           scholarship={content}/>));
    }
    return (
        <div className="p-5">
            <h1 className="col-sm-12 text-center">
                {contentType === 'scholarship' && <Link to={`/${link || contentType }`}> {title} </Link>}
                {contentType !== 'scholarship' && <Link to={`/${title.toLowerCase()}`}> {title} </Link>}
            </h1>
            {link && link.includes("/direct") &&
            <p style={{fontSize: "15px"}} className="text-center mb-3">
                (Hint: Hover over or click the blue check to learn why this scholarship has a blue check.)
            </p>
            }
            {
            description &&
            <h2 className="col-sm-12 text-center">
                {description}
            </h2>
            }
            <div className="row ml-md-4">
                {contentListDisplay}
            </div>
        </div>
    );
}

LandingPageContent.defaultProps = {
    description: null,
    contentType: null,
};
LandingPageContent.propTypes = {
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
    description: PropTypes.string,
    contentType: PropTypes.string,
    contentList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default LandingPageContent;
