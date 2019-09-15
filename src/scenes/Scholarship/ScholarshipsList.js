import React from 'react';

import {toTitleCase} from "../../services/utils";
import ScholarshipCard from "./ScholarshipCard";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import {connect} from "react-redux";

class ScholarshipsList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            model: null,
            scholarships: [],
            searchPayload: {
                location: { city :'', province :'', country :'', name :''},
                education_level :[],
                education_field :[],
                searchString: '' ,
                previewMode: 'universalSearch' ,
                filter_by_user_show_eligible_only: true,
                sort_by: 'relevance_new'
            },
            errorGettingScholarships: null,
            isLoadingScholarships: false,
            pageNumber: 1,
            totalScholarshipsCount: 0,
            totalFunding: null,
        }
    }

    loadMoreScholarships = () => {
        const { pageNumber } = this.state;

        this.setState({ pageNumber: pageNumber + 1 }, () => {
            this.loadScholarships(this.state.pageNumber);
        })
    };

    loadScholarships = (page) => {

        const {
            location : { search },
            userProfile,
        } = this.props;

        const { scholarships, totalScholarshipsCount } = this.state;

        if (totalScholarshipsCount && scholarships.length >= totalScholarshipsCount) {
            return
        }

        const params = new URLSearchParams(search);

        const searchQuery = params.get('q');

        let searchPayload = {...this.state.searchPayload};
        searchPayload.searchString = searchQuery;

        if (userProfile) {
            searchPayload = {
                sort_by: "deadline",
                filter_by_user_show_eligible_only: true
            };
        }

        this.setState({ searchPayload });

        this.setState({ isLoadingScholarships: true });

        ScholarshipsAPI.searchScholarships(searchPayload, page)
            .then(res => {

                const scholarshipResults = scholarships;
                scholarshipResults.push(...res.data.data);
                this.setState({ totalFunding: res.data.funding });
                this.setState({ totalScholarshipsCount: res.data.length });

                if (scholarshipResults) {
                    this.setState({ scholarships: scholarshipResults });
                }

            })
            .catch(err => {
                this.setState({errorGettingScholarships : err });
            })
            .finally(() => {
                this.setState({ isLoadingScholarships: false });
            });
    };

    componentDidMount() {
        this.loadScholarships();
    }

    render () {
        const {
            location : { search },
            userProfile,
        } = this.props;
        const params = new URLSearchParams(search);

        const { scholarships, isLoadingScholarships,
            totalScholarshipsCount, totalFunding,
            errorGettingScholarships} = this.state;

        const searchQuery = params.get('q');

        if (errorGettingScholarships) {
            return (
                <div className="text-center container">
                    <h1>
                        Error Getting Scholarships
                        <span role="img" aria-label="sad face emoji">😕</span>
                    </h1>
                    <h3>Please try again later </h3>
                </div>)
        }

        if (scholarships.length === 0) {
            return (
                <Loading
                    isLoading={isLoadingScholarships}
                    title={'Loading Scholarships...'} />);
        }

        return (
            <div className="container mt-5">
                <h1 className="text-center serif-font">
                    {`${totalScholarshipsCount} Scholarships ${searchQuery ? `for ${toTitleCase(searchQuery)} ` : ''}found`}
                    <br />
                </h1>
                <h2 className="text-center text-muted serif-font">
                    {totalFunding && `${totalFunding} in funding`}
                </h2>
                {!userProfile && !searchQuery &&
                <h6 className="text-center text-muted serif-font">
                    No Search query. Displaying all valid Scholarships
                </h6>
                }

                <div className="mt-3">
                    {scholarships.map( scholarship => <ScholarshipCard key={scholarship.id} className="col-12" scholarship={scholarship} />)}
                </div>
                {
                    scholarships.length < totalScholarshipsCount
                    &&
                    <button className="btn btn-primary center-block font-size-xl" onClick={this.loadMoreScholarships}>
                        Load More
                    </button>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipsList);
