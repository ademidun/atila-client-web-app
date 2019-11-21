import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {formatCurrency} from "../../services/utils";
import ScholarshipShareSaveButtons from "./ScholarshipShareSaveButtons";
import ScholarshipExtraCriteria from "./ScholarshipExtraCriteria";
import ScholarshipDeadlineWithTags from "../../components/ScholarshipDeadlineWithTags";

import {Motion, spring} from 'react-motion';

class ScholarshipCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showPreview: false,
            scholarshipHideStart: false,
            scholarshipHideFinish: false,
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

    render() {

        const { className, scholarship, viewAsUserProfile, matchScoreBreakdown, isOneColumn } = this.props;
        const { showPreview, scholarshipHideStart, scholarshipHideFinish } = this.state;

        const { name, description, funding_amount, slug, img_url } = scholarship;

        let descriptionText = showPreview ? description : `${description.substring(0,100)}`;
        if (!showPreview && description.length > 100) {
            descriptionText +='...'
        }

        const scholarshipCardStyle = {display: scholarshipHideFinish? 'none' : 'flex'};

        const fundingString = formatCurrency(Number.parseInt(funding_amount), true);
        return (
            <Motion defaultStyle={{maxHeight: 1000}}
                    style={{maxHeight: spring(scholarshipHideStart? 0 : 1000)}}
                    onRest={this.onHideScholarshipFinished}
            >
                {(interpolatingStyle)=>
                <div className={`${className} card shadow my-4`}
                        style={{...scholarshipCardStyle,...interpolatingStyle}} >
                    <div className="row no-gutters">
                        <div className={isOneColumn ? null: "col-md-4"}>
                            <img src={img_url} className="card-img mt-4" alt={name} />
                        </div>
                        <div className={isOneColumn ? null: "col-md-8"}>
                            <div className="card-body">
                                <Link to={`/scholarship/${slug}`}>
                                    <h1 className="card-title text-left">{name}</h1>
                                </Link>
                                <p className="card-text">
                                    <ScholarshipDeadlineWithTags scholarship={scholarship} />
                                    <br/>
                                    Amount: {fundingString}
                                </p>
                                <p className="card-text">{descriptionText}</p>
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