import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {formatCurrency} from "../../services/utils";
import ScholarshipShareSaveButtons from "./ScholarshipShareSaveButtons";
import ScholarshipExtraCriteria from "./ScholarshipExtraCriteria";
import ScholarshipDeadlineWithTags from "../../components/ScholarshipDeadlineWithTags";

class ScholarshipCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showPreview: false,
        }
    }

    togglePreview = (event) => {
        event.preventDefault();

        const { showPreview } = this.state;
        this.setState({ showPreview: !showPreview });

    };

    render() {

        const { className, scholarship, viewAsUserProfile } = this.props;
        const { showPreview } = this.state;
        const { name, description, deadline, funding_amount, slug, img_url } = scholarship;

        let descriptionText = showPreview ? description : `${description.substring(0,100)}`;
        if (!showPreview && description.length > 100) {
            descriptionText +='...'
        }

        const fundingString = formatCurrency(Number.parseInt(funding_amount), true);
        return (
            <div className={`${className} card shadow my-4`}>
                <div className="row no-gutters">
                    <div className="col-md-4">
                        <img src={img_url} className="card-img mt-4" alt={name} />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <Link to={`/scholarship/${slug}`}>
                                <h1 className="card-title text-left">{name}</h1>
                            </Link>
                            <p className="card-text">
                                Deadline: <ScholarshipDeadlineWithTags deadline={deadline } />
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
                            <ScholarshipShareSaveButtons scholarship={scholarship} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ScholarshipCard.defaultProps = {
    className: '',
    viewAsUserProfile: null,
};

ScholarshipCard.propTypes = {
    className: PropTypes.string,
    scholarship: PropTypes.shape({}),
    viewAsUserProfile: PropTypes.shape({}),
};

export default ScholarshipCard;