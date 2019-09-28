import React from 'react';

import {toTitleCase} from "../../services/utils";
import ScholarshipCard from "./ScholarshipCard";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";
import {connect} from "react-redux";
import {isCompleteUserProfile} from "../../models/UserProfile";
import UserProfileEdit from "../UserProfile/UserProfileEdit";
import {Link} from "react-router-dom";

class ScholarshipsList extends React.Component {

    constructor(props) {
        super(props);

        const { userProfile } = this.props;

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
            isCompleteProfile: !userProfile || isCompleteUserProfile(userProfile)
        }
    }

    componentDidMount() {
        this.loadScholarships();
    }

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

        const searchQuery = params.get('q');

        let loadMoreScholarshipsOrRegisterCTA = null;

        if(userProfile) {
            loadMoreScholarshipsOrRegisterCTA = (<React.Fragment>
                {
                    scholarships.length < totalScholarshipsCount
                    &&
                    <button className="btn btn-primary center-block font-size-xl" onClick={this.loadMoreScholarships}>
                        Load More
                    </button>
                }
            </React.Fragment>);
        } else if (!userProfile) {
            loadMoreScholarshipsOrRegisterCTA = (<React.Fragment>
                {
                    scholarships.length < totalScholarshipsCount
                    &&
                    <Link to="/register" className="btn btn-primary center-block font-size-xl">
                            Register for Free to see all
                            {totalScholarshipsCount > 3 ? ` ${totalScholarshipsCount} ` : null}
                            Scholarships
                    </Link>
                }
            </React.Fragment>);
        }

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
                <h6 className="text-center text-muted serif-font">
                    Complete Profile to see all eligible scholarships
                </h6>
                {missingSections}
                </React.Fragment>
                );
            return <UserProfileEdit title={title}
                                    className={"container mt-5"}
                                    afterSubmitSuccess={this.afterProfileEdit} />
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
                {loadMoreScholarshipsOrRegisterCTA}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipsList);
