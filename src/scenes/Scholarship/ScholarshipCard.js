import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {formatCurrency} from "../../services/utils";
import ScholarshipShareSaveButtons from "./ScholarshipShareSaveButtons";
import ScholarshipExtraCriteria from "./ScholarshipExtraCriteria";
import ScholarshipDeadlineWithTags from "../../components/ScholarshipDeadlineWithTags";
import "./ScholarshipCard.scss";

import {Motion, spring} from 'react-motion';
import {AtilaDirectApplicationsPopover} from "../../models/Scholarship";
import verifiedBadge from "../../components/assets/verified.png";

class ScholarshipCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showPreview: false,
            scholarshipHideStart: false,
            scholarshipHideFinish: false,
            insights: props.insights,
        }
    }

    togglePreview = (event) => {
        event.preventDefault();

        const { showPreview } = this.state;
        this.setState({ showPreview: !showPreview });

    };

    onHideScholarship = () => {
        this.setState({ scholarshipHideStart: true });
    };
    onHideScholarshipFinished = () => {
        this.setState({ scholarshipHideFinish: true });
    };

    sendAlgoliaAnalyticsEvent = () => {
        console.log('sending event to algolia');
        this.state.insights('clickedObjectIDsAfterSearch', {
          eventName: 'Scholarship Clicked'
        })
        console.log('event sent');
    }

    render() {

        const { className, scholarship, viewAsUserProfile, matchScoreBreakdown, isOneColumn } = this.props;
        const { showPreview, scholarshipHideStart, scholarshipHideFinish } = this.state;

        const { name, description, funding_amount, slug, img_url } = scholarship;

        let descriptionText = showPreview ? description : `${description.substring(0,100)}`;
        if (!showPreview && description.length > 100) {
            descriptionText +='...'
        }

        const scholarshipCardStyle = {display: scholarshipHideFinish? 'none' : 'flex'};

        let fundingString = formatCurrency(Number.parseInt(funding_amount), true);

        if (funding_amount === 0) {
            fundingString = "varies";
        }

        return (
            <Motion defaultStyle={{maxHeight: 1000}}
                    style={{maxHeight: spring(scholarshipHideStart? 0 : 1000)}}
                    onRest={this.onHideScholarshipFinished}
            >
                {(interpolatingStyle)=>
                <div className={`${className} card shadow my-4`}
                        style={{...scholarshipCardStyle,...interpolatingStyle}} >
                    <div className="row no-gutters d-block">
                        <div className={`card-img-container ${isOneColumn ? "" : "col-md-4"}`}>
                            <img src={img_url}
                                 className="card-img mt-4"
                                 alt={name}
                                 style={{
                                     height: "auto",
                                     maxHeight: "200px",
                                     objectFit: "contain"
                                 }} />
                        </div>
                        <div className={isOneColumn ? null: "col-md-8"}>
                            <div className="card-body" style={{maxHeight: '500px', overflow: 'auto'}}>
                                <h1 className="card-title text-left">
                                <Link to={`/scholarship/${slug}`} onClick={this.sendAlgoliaAnalyticsEvent}>
                                        {name}
                                </Link>{' '}
                                    {scholarship.is_atila_direct_application &&
                                    <AtilaDirectApplicationsPopover
                                        title="This is a verified Atila Direct Application Scholarship"
                                        children={<img
                                            alt="user profile"
                                            style={{ width:'25px' }}
                                            className="rounded-circle"
                                            src={verifiedBadge} />} />}
                                </h1>
                                <div className="card-text">
                                    <ScholarshipDeadlineWithTags scholarship={scholarship} addDeadlineToCalendar={true} />
                                    <br/>
                                    Amount: {fundingString}
                                </div>
                                <div className="card-text">{descriptionText}</div>
                                {showPreview &&
                                <ScholarshipExtraCriteria scholarship={scholarship} viewAsUserProfile={viewAsUserProfile} />
                                }
                                <button className="btn btn-link" onClick={this.togglePreview} >
                                    {showPreview ? 'Show Less' : 'Show More'}
                                </button>
                                {isOneColumn && <br />}
                                <ScholarshipShareSaveButtons scholarship={scholarship}
                                                             onHideScholarship={this.onHideScholarship} />
                            </div>
                        </div>
                    </div>
                    { matchScoreBreakdown &&
                    <pre style={{maxHeight: '350px'}}>
                        {JSON.stringify(matchScoreBreakdown, null, 4)}
                    </pre>
                    }
                </div>
                }
            </Motion>
        );
    }
}

ScholarshipCard.defaultProps = {
    className: '',
    viewAsUserProfile: null,
    matchScoreBreakdown: null,
    isOneColumn: null,
};

ScholarshipCard.propTypes = {
    className: PropTypes.string,
    isOneColumn: PropTypes.bool,
    scholarship: PropTypes.shape({}),
    viewAsUserProfile: PropTypes.shape({}),
    matchScoreBreakdown: PropTypes.shape({}),
};

export default ScholarshipCard;