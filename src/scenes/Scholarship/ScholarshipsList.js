import React from 'react';

import {toTitleCase} from "../../services/utils";
import ScholarshipCard from "./ScholarshipCard";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {connect} from "react-redux";
import {isCompleteUserProfile} from "../../models/UserProfile";
import UserProfileEdit from "../UserProfile/UserProfileEdit";
import {Link} from "react-router-dom";
import ResponseDisplay from "../../components/ResponseDisplay";

class ScholarshipsList extends React.Component {

    constructor(props) {
        super(props);

        const { userProfile,
            location : { search }
        } = this.props;

        const params = new URLSearchParams(search);
        const searchString = params.get('q');

        this.state = {
            model: null,
            scholarships: null,
            searchPayload: {
                location: { city :'', province :'', country :'', name :''},
                education_level :[],
                education_field :[],
                searchString ,
                previewMode: 'universalSearch' ,
                filter_by_user_show_eligible_only: true,
                sort_by: 'relevance_new'
            },
            searchString,
            errorGettingScholarships: null,
            isLoadingScholarships: true,
            pageNumber: 1,
            totalScholarshipsCount: 0,
            totalFunding: null,
            isCompleteProfile: !userProfile || isCompleteUserProfile(userProfile)
        }
    }

    componentDidMount() {
        this.loadScholarships();
    }

    loadScholarships = (page) => {

        const {
            userProfile,
        } = this.props;

        const { scholarships } = this.state;
        let { searchPayload } = this.state;

        if (userProfile && !searchPayload.searchString) {
            searchPayload = {
                sort_by: "deadline",
                filter_by_user_show_eligible_only: true
            };
        }

        ScholarshipsAPI.searchScholarships(searchPayload, page)
            .then(res => {

                const scholarshipResults = scholarships || [];
                if (userProfile) {
                    scholarshipResults.push(...res.data.data);
                } else {
                    scholarshipResults.push(...res.data.data.slice(0,3));
                }
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

    loadMoreScholarships = () => {
        const { pageNumber } = this.state;

        this.setState({ pageNumber: pageNumber + 1 }, () => {
            this.loadScholarships(this.state.pageNumber);
        })
    };

    afterProfileEdit = () => {
        const { userProfile } = this.props;

        this.setState({ isCompleteProfile: !userProfile || isCompleteUserProfile(userProfile) });
    };

    render () {
        const {
            location : { search },
            userProfile,
        } = this.props;
        const params = new URLSearchParams(search);

        const { scholarships, isLoadingScholarships,
            totalScholarshipsCount, totalFunding,
            errorGettingScholarships, isCompleteProfile} = this.state;

        const searchString = params.get('q');

        let loadMoreScholarshipsOrRegisterCTA = null;

        if(userProfile) {
            loadMoreScholarshipsOrRegisterCTA = (<React.Fragment>
                {
                    scholarships && scholarships.length < totalScholarshipsCount
                    &&
                    <button className="btn btn-primary center-block font-size-xl" onClick={this.loadMoreScholarships}>
                        Load More
                    </button>
                }
                {
                    scholarships && scholarships.length >= totalScholarshipsCount
                    &&
                    <h4 className="text-center">
                        All Caught up {' '}
                        <span role="img" aria-label="happy face emoji">🙂</span>
                    </h4>
                }

            </React.Fragment>);
        } else if (!userProfile) {
            loadMoreScholarshipsOrRegisterCTA = (<React.Fragment>
                {
                    scholarships && scholarships.length < totalScholarshipsCount
                    &&
                    <Link to="/register" className="btn btn-primary center-block font-size-xl">
                            Register for Free to see all
                            {totalScholarshipsCount > 3 ? ` ${totalScholarshipsCount} ` : null}
                            Scholarships
                    </Link>
                }
            </React.Fragment>);
        }

        if (userProfile && !isCompleteProfile) {

            let missingSections = null;

            if (!userProfile.post_secondary_school || !userProfile.major) {
                missingSections = (<ul>
                    The Following questions are missing:
                    {! userProfile.major &&
                    <li><strong>Major: </strong>What program are you currently or interested in?</li>
                    }
                    {! userProfile.post_secondary_school &&
                    <li><strong>Post Secondary School</strong>: What school are you currently or interested in attending?</li>
                    }

                </ul>)
            }
            const title = (<React.Fragment>
                <h1 className="text-center serif-font">
                    <span role="img" aria-label="shrug shoulders emoji">
                    🤷🏾‍♀
                    </span>
                        ️ Scholarships Found
                    <br />
                </h1>
                <h2 className="text-center text-muted serif-font">
                    <span role="img" aria-label="shrug shoulders emoji">
                        🤷🏾‍♀️
                    </span>
                        in Funding
                </h2>
                <h1 className="text-center font-weight-bold serif-font">
                    Complete Your Profile to see all eligible scholarships
                </h1>
                {missingSections}
                </React.Fragment>
                );
            return <UserProfileEdit title={title}
                                    className={"container mt-5"}
                                    afterSubmitSuccess={this.afterProfileEdit} />
        }

        return (
            <div className="container mt-5">

                <ResponseDisplay
                    responseError={errorGettingScholarships}
                    isLoadingResponse={isLoadingScholarships}
                    loadingTitle={"Loading Scholarships..."}
                />
                <h1 className="text-center serif-font">
                    {`${totalScholarshipsCount} Scholarships ${searchString ? `for ${toTitleCase(searchString)} ` : ''}found`}
                    <br />
                </h1>
                <h2 className="text-center text-muted serif-font">
                    {totalFunding && `${totalFunding} in funding`}
                </h2>
                {!userProfile && !searchString &&
                <h6 className="text-center text-muted serif-font">
                    No Search query. Displaying all valid Scholarships
                </h6>
                }
                <div className="w-100 mb-3">
                    <Link to={`/scholarship/add`} className="btn btn-link">
                        Add a Scholarship
                    </Link>
                </div>

                <div className="mt-3">
                    {scholarships &&
                    scholarships.map( scholarship => <ScholarshipCard key={scholarship.id}
                                                                      className="col-12"
                                                                      scholarship={scholarship} />)
                    }
                </div>
                {loadMoreScholarshipsOrRegisterCTA}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipsList);
