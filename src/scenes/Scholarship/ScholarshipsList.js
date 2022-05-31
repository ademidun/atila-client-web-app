/**
    The `ScholarhipsList` component displays a list of scholarships based on the user's profile or a searched string.
    If no search term is entered the scholarships list is retrieved from the atila-django API.
    However, if a search term is entered the scholarships list is retrieved from the Algolia API.
 */
import React from 'react';

import {myJoin, prettifyKeys, toTitleCase, transformFilterDisplay, unSlugify} from "../../services/utils";
import ScholarshipCard from "./ScholarshipCard";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {connect} from "react-redux";
import {isCompleteUserProfile} from "../../models/UserProfile";
import {Link} from "react-router-dom";
import ResponseDisplay from "../../components/ResponseDisplay";
import HelmetSeo, {defaultSeoContent} from "../../components/HelmetSeo";
import {Alert, Button} from "antd";
import UserProfileAPI from "../../services/UserProfileAPI";
import AnalyticsService from "../../services/AnalyticsService";
import SearchAlgolia from "../Search/Search";
import equal from "fast-deep-equal";
import TextUtils from '../../services/utils/TextUtils';

class ScholarshipsList extends React.Component {

    constructor(props) {
        super(props);

        const { userProfile,
            match : { params : { searchString: searchStringRaw } },
            location: { pathname },
        } = props;

        const searchString = unSlugify(searchStringRaw);

        this.state = {
            model: null,
            scholarships: null,
            scholarshipSearchResults: null,
            searchPayload: {
                searchString ,
                previewMode: userProfile && !searchString ? null : 'universalSearch',
                filter_by_user_show_eligible_only: true,
                sort_by: 'relevance_new'
            },
            searchString,
            initialSearchString: searchString,
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
            isViewingDirectApplications: pathname.includes("/scholarship/direct")
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

        const { scholarships, totalScholarshipsCount,
            scholarshipsScoreBreakdown, isViewingDirectApplications } = this.state;
        let { searchPayload } = this.state;

        searchPayload = {
            ...searchPayload,
            previewMode: searchPayload.view_as_user ? null : searchPayload.previewMode,
        };

        if (isViewingDirectApplications) {
            searchPayload.direct_applications_only = true
        }

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
                    /*
                     Since we are trying to promote the direct application scholarships we have,
                     default to showing more applications. Show 5 instead of 3.
                    */
                    const resultsLimit = isViewingDirectApplications ? 5 : 3;
                    scholarshipResults.push(...res.data.data.slice(0,resultsLimit));
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
                    AnalyticsService.saveSearchAnalytics({search_results}, userProfile)
                    .then()
                    .catch(err=>{console.log({err})});
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

    getFilterHeader = (filterItems, filterValue, userProfile) => {
        if (filterItems.length === 0) {

            return (<h3>
                    No {filterValue} found for your profile <br/>
                    {userProfile &&
                        <>
                    <Link to={`/profile/${userProfile.username}/edit`}>Edit profile</Link> to filter by {filterValue}.
                        </>}
            </h3>)
        } else {
            return (<h3>
                (Filtering by {filterValue}: {' '}
                {/*change next line*/}
                <strong>
                    {myJoin(filterItems, ', ')})
                </strong> <br />
                {!userProfile &&
                <p>
                    Using default {filterValue}. {' '}
                    <Link to="/register">
                        Sign up {' '}
                    </Link>
                    to filter by your own {filterValue}.
                </p>}
            </h3>)
        }
    };

    handleSearchResultsLoaded = results => {
        let scholarshipSearchResults = results[0].items
        let totalScholarshipsCount = results[0].num_items
        let totalFunding = 0
        scholarshipSearchResults.forEach(scholarship => totalFunding += scholarship.funding_amount)
        totalFunding = TextUtils.formatCurrency(totalFunding, "CAD", true);
        if (totalFunding !== this.state.totalFunding) {
            this.setState({totalFunding});
        }
        if (totalScholarshipsCount !== this.state.totalScholarshipsCount) {
            this.setState({totalScholarshipsCount})
        }
        if (!equal(scholarshipSearchResults, this.state.scholarshipSearchResults)) {
            this.setState({scholarshipSearchResults});
        }
    }

    handleSearchQueryChanged = (updatedSearchString) => {
        this.setState({searchString: updatedSearchString.query});
    }

    render () {
        const { userProfile } = this.props;

        const { scholarships, scholarshipSearchResults, isLoadingScholarships,
            totalScholarshipsCount, totalFunding,
            errorGettingScholarships, searchPayload,
            searchString, initialSearchString,
            pageNumber, viewAsUserString, viewAsUserProfile, viewAsUserError, scholarshipsScoreBreakdown} = this.state;

        const isUsingAtila = !searchString;
        let loadMoreScholarshipsOrRegisterCTA = null;

        if(userProfile) {
            loadMoreScholarshipsOrRegisterCTA = (<React.Fragment>
                {
                    scholarships && scholarships.length < totalScholarshipsCount
                    && isUsingAtila
                    &&
                    <button className="btn btn-primary center-block font-size-xl"
                            onClick={this.loadMoreScholarships}
                            disabled={isLoadingScholarships}>
                        Load More
                    </button>
                }
                {
                    scholarships && scholarships.length >= totalScholarshipsCount
                    && isUsingAtila &&
                    <h4 className="text-center">
                        All Caught up {' '}
                        <span role="img" aria-label="happy face emoji">🙂</span>
                    </h4>
                }

            </React.Fragment>);
        } else if (!userProfile) {
            loadMoreScholarshipsOrRegisterCTA = (<div className="font-size-xl">
                {
                    (scholarships || scholarshipSearchResults) &&
                        <Button type="primary" className="font-size-larger col-12 mt-1" style={{fontSize: "25px"}}>
                            <Link to="/register">
                                    Register for free and see
                                    {isUsingAtila && scholarships?.length < totalScholarshipsCount ?
                                        ` all ${totalScholarshipsCount} ` : " more "}
                                    scholarships
                            </Link>
                        </Button>
                }

                <Button type="primary" className="font-size-larger col-12 my-3" style={{fontSize: "25px"}}>
                    <Link to="/start">
                        Start a scholarship
                    </Link>
                </Button>
            </div>);
        }

        let missingSections = null;

        if (userProfile && !isCompleteUserProfile(userProfile)) {
        
            const missingSectionsDescription = (
            <div>

            <Link to="/profile/edit">Edit your profile</Link> to see better scholarship matches
            <ul>
                The following fields are missing:
                {! userProfile.major &&
                <li><strong>Major: </strong>What program are you currently or interested in pursuing?</li>
                }
                {! userProfile.post_secondary_school &&
                <li><strong>Post Secondary School</strong>: What school are you currently or interested in attending?</li>
                }

            </ul>
            </div>
            );

           missingSections =  (<Alert
            message = "Warning: Missing school and profile information"
            description={missingSectionsDescription}
            type="warning"
            showIcon
        />);
        }

        const seoContent = {
            ...defaultSeoContent
        };
        let dynamicTitle = '';
        if (!Number.isNaN(totalScholarshipsCount) && totalFunding) {
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
                {missingSections}
                {(scholarships || scholarshipSearchResults) &&
                    <div className="text-center">
                        <h1>
                            {dynamicTitle}
                            <br />
                        </h1>
                        {searchPayload.filter_by_user &&
                        this.getFilterHeader(transformFilterDisplay(searchPayload.filter_by_user, userProfile),
                            prettifyKeys(searchPayload.filter_by_user), userProfile)
                        }
                        <h2 className="text-muted">
                            {totalFunding && `${totalFunding} in funding`}
                        </h2>
                        <h3>
                            {userProfile &&
                            <Button type="link"
                                    onClick={this.toggleViewAllScholarships}
                                    style={{fontSize: '1.5rem', height: "auto"}}>
                                <div style={{whiteSpace: "break-spaces"}}>
                                    View {searchPayload.previewMode === 'universalSearch' ? 'scholarships for my profile' :
                                    'all Scholarships'}
                                </div>
                            </Button>
                            }
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
                {/* TEMP: hide Add a Scholarship. It's rarely used by most users and add clutter to scholarships list page */}
                {/* <div className="w-100 mb-3">
                    <Link to={`/scholarship/add`} className="btn btn-outline-primary">
                        Add a Scholarship
                    </Link>
                </div> */}

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
                <SearchAlgolia showScholarshipsOnly={true}
                               onSearchQueryChanged={this.handleSearchQueryChanged}
                               initialSearch={initialSearchString}
                               onResultsLoaded={this.handleSearchResultsLoaded}
                               className=""
                               renderSeo={false}
                />
                {scholarships && isUsingAtila &&
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
