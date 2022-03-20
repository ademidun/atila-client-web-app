import React from 'react';

import {toTitleCase, unSlugify} from "../../services/utils";

import {connect} from "react-redux";
import {Link} from "react-router-dom";

import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import SearchAlgolia from "../Search/Search";
import {Button} from "antd";
import equal from "fast-deep-equal";

class ScholarshipsList extends React.Component {

    constructor(props) {
        super(props);

        const {location: { pathname }} = props;

        this.state = {
            algoliaScholarships: [],
            isViewingDirectApplications: pathname.includes("/scholarship/direct")
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const { algoliaScholarships: prevScholarships } = this.state;
        const { algoliaScholarships: nextScholarships } = nextState;

        if (equal(prevScholarships, nextScholarships)){
            return false
        }
        return true
    }

    parseResults = (results) => {
        const algoliaScholarships = results[0].hits
        console.log({algoliaScholarships})
        this.setState({algoliaScholarships})
    }

    calculateTotalFunding = algoliaScholarships =>  {
        let totalFunding = 0
        algoliaScholarships.forEach(scholarship => totalFunding += scholarship.funding_amount)
        return totalFunding
    }

    render () {
        const {
            match : { params : { searchString: searchStringRaw } }, location, history
        } = this.props;

        const searchString = unSlugify(searchStringRaw);

        const { algoliaScholarships } = this.state;
        const totalFunding = this.calculateTotalFunding(algoliaScholarships)

        let totalScholarshipsCount = algoliaScholarships.length

        const seoContent = {
            ...defaultSeoContent
        };
        let dynamicTitle = '';
        if (algoliaScholarships) {
            dynamicTitle = `${totalScholarshipsCount} Scholarship${totalScholarshipsCount === 1 ? '' :'s'}
             ${searchString ? `for ${toTitleCase(searchString)} ` : ''}found`;
            seoContent.title = `${dynamicTitle}${totalFunding !== '$0'? ` and ${totalFunding} in funding` : ''}`;
            seoContent.title += `${searchString ? ` available for ${toTitleCase(searchString)} scholarships` : ''}`;
            seoContent.title += ' - Atila';
            seoContent.description = seoContent.title;
            seoContent.slug = `/scholarship/s/${searchString}`
        }


        return (
            <div className="container mt-5">
                <HelmetSeo content={seoContent} />
                <div className="text-center">
                    <h1>
                        {dynamicTitle}
                        <br />
                    </h1>

                    <h2 className="text-muted">
                        {totalFunding && `$${totalFunding} in funding`}
                    </h2>

                </div>

                <Link to={`/scholarship/add`}>
                    <Button type={"primary"}>
                        Add a Scholarship
                    </Button>
                </Link>
                <SearchAlgolia location={location}
                               history={history}
                               showScholarshipsOny={true}
                               resultsCB={results => this.parseResults(results)}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipsList);
