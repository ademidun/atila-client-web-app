import React from 'react';

import {myJoin, prettifyKeys, toTitleCase, transformFilterDisplay, unSlugify} from "../../services/utils";
import ScholarshipCard from "./ScholarshipCard";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {connect} from "react-redux";
import {isCompleteUserProfile} from "../../models/UserProfile";
import UserProfileEdit from "../UserProfile/UserProfileEdit";
import {Link} from "react-router-dom";
import ResponseDisplay from "../../components/ResponseDisplay";
import ScholarshipsListFilter from "./ScholarshipsListFilter";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import {Button} from "antd";
import UserProfileAPI from "../../services/UserProfileAPI";
import AnalyticsService from "../../services/AnalyticsService";

class ScholarshipsList extends React.Component {

    constructor(props) {
        super(props);

        const { userProfile,
            match : { params : { searchString: searchStringRaw } },
        } = this.props;

        const searchString = unSlugify(searchStringRaw);

        this.state = {
            model: null,
            scholarships: null,
            searchPayload: {
                searchString ,
                previewMode: userProfile && !searchString ? null : 'universalSearch',
                filter_by_user_show_eligible_only: true,
                sort_by: 'relevance_new'
            },
            searchString,
            viewAsUserString: '',
            viewAsUserProfile: null,
            viewAsUserError: null,
            prevSearchString: null,
            errorGettingScholarships: null,
            isLoadingScholarships: true,
            scholarshipsScoreBreakdown: null,
            pageNumber: 1,
            totalScholarshipsCount: 0,
            totalFunding: null,
            isCompleteProfile: !userProfile || isCompleteUserProfile(userProfile)
        }
    }

    componentDidMount() {
        this.loadScholarships();
    }

    static getDerivedStateFromProps(props, state) {
        // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change
        // Store prevSlug in state so we can compare when props change.
        // Clear out previously-loaded data (so we don't render stale stuff).
        const { prevSearchString } = state;
        const { match : { params : { searchString: searchStringRaw } } } = props;
        const searchString = unSlugify(searchStringRaw);

        if (searchString !== prevSearchString) {
            return {
                ...state,
                prevSearchString: searchString,
                scholarships: null,
                isLoadingScholarships: true,
            };
        }

        // No state update necessary
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        const { prevSearchString } = this.state;

        if (prevSearchString !== prevState.prevSearchString) {
            this.loadScholarships();
        }
    }

    toggleViewAllScholarships = () => {

        const { searchPayload } = this.state;
        const updatedSearchPayload = {
            ...searchPayload,
            previewMode: searchPayload.previewMode === "universalSearch" ? null : 'universalSearch',
        };

        this.setState({
            searchPayload: updatedSearchPayload,
            scholarships: []
        }, () => {
            this.loadScholarships();
        })

    };

    loadScholarships = (page=1) => {

        const {
            userProfile,
        } = this.props;

        const { scholarships, totalScholarshipsCount, scholarshipsScoreBreakdown } = this.state;
        let { searchPayload } = this.state;

        searchPayload = {
            ...searchPayload,
            previewMode: searchPayload.view_as_user ? null : searchPayload.previewMode,
        };

        if (totalScholarshipsCount && scholarships
            && scholarships.length >= totalScholarshipsCount) {
            return
        }

        this.setState({ isLoadingScholarships: true, errorGettingScholarships: null });

        ScholarshipsAPI.searchScholarships(searchPayload, page)
            .then(res => {

                const scholarshipResults = scholarships || [];
                if (userProfile) {
                    scholarshipResults.push(...res.data.data);
                    const viewAsUserProfile = res.data.view_as_user;
                    const viewAsUserError = res.data.view_as_user_error;
                    this.setState({ viewAsUserProfile });
                    this.setState({ viewAsUserError });
                    const updatedScoreBreakdown = Object.assign({},
                        scholarshipsScoreBreakdown,
                        res.data.scholarships_score_breakdown);

                    this.setState({ scholarshipsScoreBreakdown: updatedScoreBreakdown });
                } else {
                    scholarshipResults.push(...res.data.data.slice(0,3));
                }
                this.setState({ totalFunding: res.data.funding });
                this.setState({ totalScholarshipsCount: res.data.length });
                if(page===1) {
                    const fundingAsNumber =  Number(res.data.funding.replace(/[^0-9.-]+/g,""));
                    const search_results = {
                        search_payload: searchPayload,
                        results_count: res.data.length,
                        funding: fundingAsNumber,
                        type: 'scholarships',
                    };
                    AnalyticsService.saveSearchAnalytics({search_results}, userProfile).then();
                }
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

        this.setState({ pageNumber: pageNumber + 1, isLoadingScholarships: true }, () => {
            this.loadScholarships(this.state.pageNumber);
        })
    };

    afterProfileEdit = () => {
        // scroll to the top of page so that the user can look at scholarship's list from the top
        window.scrollTo(0, 0);
        const { userProfile } = this.props;

        this.setState({ isCompleteProfile: !userProfile || isCompleteUserProfile(userProfile) });
    };

    onUpdateStateHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    updateFilterOrSortOnEnterPress = (event) => {
        if(event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault();
            this.updateFilterOrSort(event);
        }
    };

    updateFilterOrSort = (event) => {
        const { searchPayload } = this.state;
        const {
            userProfile,
        } = this.props;

        let updatedSearchPayload = searchPayload;

        if (event.target.name === 'filter_by_user') {
            updatedSearchPayload = {
                ...searchPayload,
                [event.target.name]: event.target.value,
                filter_by_user_data: [
                    {
                        filter_type: event.target.value,
                        filter_value: [transformFilterDisplay(event.target.value, userProfile)]
                    }
                ]
            }
        } else if (event.target.name === 'viewAsUserString'){
            updatedSearchPayload = {
                ...searchPayload,
                view_as_user: event.target.value
            };
            if (event.target.value === '') {
                delete updatedSearchPayload.view_as_user;
            }
        } else if (event.target.name === 'sort_by'){
            updatedSearchPayload = {
                ...searchPayload,
                [event.target.name]: event.target.value
            }
        } else {
            delete updatedSearchPayload.filter_by_user;
            delete updatedSearchPayload.filter_by_user_data;
        }
        this.setState({
            scholarships: null,
            searchPayload : updatedSearchPayload,
            pageNumber: 1,
            isLoadingScholarships: true,
        }, () => {this.loadScholarships()})
    };

    refreshScholarshipCache = () => {
        let {
            userProfile : {user : userId},
        } = this.props;
        const { viewAsUserProfile} = this.state;

        if (viewAsUserProfile) {
            userId  = viewAsUserProfile.user;
        }

        this.setState({ isLoadingScholarships: true, scholarships: null }, () => {
            UserProfileAPI.refreshScholarshipCache(userId)
                .then(() => {
                    this.loadScholarships(this.state.pageNumber);
                })
                .catch((errorRefreshingCache)=>{
                    console.log({err: errorRefreshingCache});
                    this.setState({ isLoadingScholarships: false,
                        errorGettingScholarships : errorRefreshingCache });
                })
        })
    };

    getFilterHeader = (filterItems, filterValue) => {
        if ((filterItems === '') || (filterItems === [])) {
            return (<h3>
                <Link to={`/profile/${userProfile.username}/edit`}>Edit Profile</Link> to filter by {filterValue}.
            </h3>)
        } else {
            return (<h3>
                (Filtering by {filterItems}: {' '}
                {/*change next line*/}
                <strong>
                    {myJoin(filterItems, ', ')})
                </strong>
            </h3>)
        }
    }

    render () {
        const {
            match : { params : { searchString: searchStringRaw } },
            userProfile,
        } = this.props;
        const searchString = unSlugify(searchStringRaw);

        const { scholarships, isLoadingScholarships,
            totalScholarshipsCount, totalFunding,
            errorGettingScholarships, isCompleteProfile, searchPayload,
            pageNumber, viewAsUserString, viewAsUserProfile, viewAsUserError, scholarshipsScoreBreakdown} = this.state;

        let loadMoreScholarshipsOrRegisterCTA = null;

        if(userProfile) {
            loadMoreScholarshipsOrRegisterCTA = (<React.Fragment>
                {
                    scholarships && scholarships.length < totalScholarshipsCount
                    &&
                    <button className="btn btn-primary center-block font-size-xl"
                            onClick={this.loadMoreScholarships}
                            disabled={isLoadingScholarships}>
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
                    <li><strong>Major: </strong>What program are you currently or interested in pursuing?</li>
                    }
                    {! userProfile.post_secondary_school &&
                    <li><strong>Post Secondary School</strong>: What school are you currently or interested in attending?</li>
                    }

                </ul>)
            }
            const title = (<React.Fragment>
                <h1 className="text-center">
                    Final Step
                </h1>
                <h1 className="text-center font-weight-bold">
                    Complete Your Profile to see all eligible scholarships
                </h1>
                {missingSections}
                </React.Fragment>
                );
            return <UserProfileEdit title={title}
                                    className={"container mt-5"}
                                    afterSubmitSuccess={this.afterProfileEdit}
                                    startingPageNumber={0}
                                    submitButtonText="Save and See Scholarships" />
        }

        const seoContent = {
            ...defaultSeoContent
        };
        let dynamicTitle = '';
        if (scholarships) {
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
                <ResponseDisplay
                    responseError={errorGettingScholarships}
                    isLoadingResponse={isLoadingScholarships}
                    loadingTitle={"Loading Scholarships..."}
                />
                {scholarships &&
                    <div className="text-center">
                        <h1>
                            {dynamicTitle}
                            <br />
                        </h1>
                        {searchPayload.filter_by_user &&
                        this.getFilterHeader(transformFilterDisplay(searchPayload.filter_by_user, userProfile),
                        transformFilterDisplay(prettifyKeys(searchPayload.filter_by_user)))
                        }
                        <h2 className="text-muted">
                            {totalFunding && `${totalFunding} in funding`}
                        </h2>
                        <h3>

                            <Button type="link"
                                    onClick={this.toggleViewAllScholarships}
                                    style={{fontSize: '1.5rem'}}>
                                View {searchPayload.previewMode === 'universalSearch' ? 'scholarships for my profile' :
                                'all Scholarships' }
                            </Button>
                        </h3>

                        {viewAsUserProfile &&
                        <h5 className="text-success">Viewing as {viewAsUserProfile.username}</h5>
                        }
                        {viewAsUserError &&
                        <h5 className="text-danger">{viewAsUserError}</h5>
                        }
                        {!userProfile && !searchString &&
                        <h6 className="text-muted">
                            No search query. Displaying all valid scholarships.
                        </h6>
                        }
                        {userProfile && searchPayload.previewMode === 'universalSearch' &&
                        <h6 className="text-muted">
                            No search filtering. Displaying all valid scholarships.
                        </h6>
                        }
                    </div>
                }
                <div className="w-100 mb-3">
                    <Link to={`/scholarship/add`} className="btn btn-outline-primary">
                        Add a Scholarship
                    </Link>
                </div>

                {userProfile && userProfile.is_atila_admin &&
                <div style={{maxWidth: '250px'}} className="my-3">
                    <input placeholder="View as user (enter to submit)"
                           className="form-control"
                           name="viewAsUserString"
                           value={viewAsUserString}
                           onChange={this.onUpdateStateHandler}
                           onKeyDown={this.updateFilterOrSortOnEnterPress}
                    />
                    <Button onClick={this.refreshScholarshipCache}
                            className="my-3">
                        Refresh Cache {viewAsUserProfile ? `for ${viewAsUserProfile.username}` : null}
                    </Button>
                </div>
                }
                <ScholarshipsListFilter model={userProfile} updateFilterOrSortBy={this.updateFilterOrSort} />

                    {scholarships &&
                    <div className="mt-3">
                        {scholarships.map( scholarship =>
                            <ScholarshipCard
                                        key={scholarship.id}
                                        className="col-12"
                                        scholarship={scholarship}
                                        viewAsUserProfile={viewAsUserProfile}
                                        matchScoreBreakdown={scholarshipsScoreBreakdown &&
                                        scholarshipsScoreBreakdown[scholarship.id]} />)}
                    </div>
                    }
                {loadMoreScholarshipsOrRegisterCTA}
                {pageNumber > 1 &&
                <ResponseDisplay
                    responseError={errorGettingScholarships}
                    isLoadingResponse={isLoadingScholarships}
                    loadingTitle={"Loading Scholarships..."}
                />
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipsList);
