import React from 'react';
import { Link } from "react-router-dom";
import moment from "moment";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import { formatCurrency, genericItemTransform, guestPageViewsIncrement, scrollToElement } from "../../services/utils";
import Loading from "../../components/Loading";
import RelatedItems from "../../components/RelatedItems";
import { connect } from "react-redux";
import AnalyticsService from "../../services/AnalyticsService";
import ScholarshipShareSaveButtons from "./ScholarshipShareSaveButtons";
import HelmetSeo from "../../components/HelmetSeo";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import AtilaPointsPaywallModal from "../../components/AtilaPointsPaywallModal";
import ScholarshipExtraCriteria from "./ScholarshipExtraCriteria";
import ScholarshipDeadlineWithTags from "../../components/ScholarshipDeadlineWithTags";
import { Alert, Button, message, Tag } from 'antd';
import verifiedBadge from '../../components/assets/verified.png';
import { AtilaDirectApplicationsPopover, BlindApplicationsExplanationMessage, ReferralBonusScholarshipExplanationMessage } from "../../models/Scholarship";
import ScholarshipFinalists, { UserProfilesCards } from "./ScholarshipFinalists";
import ApplicationsLocal from '../Application/ApplicationsLocal';
import ReportIncorrectInfo from "../../components/ReportIncorrectInfo";
import AwardDetail from "../Award/AwardDetail";
import { addStyleClasstoTables } from "../../services/utils";
import './ScholarshipDetail.scss';
import $ from "jquery";

class ScholarshipDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarship: null,
            contributors: null,
            awards: [],
            currentUserScholarshipApplication: null,
            scholarshipUserProfile: null,
            isLoadingScholarship: true,
            isLoadingApplication: false,
            errorLoadingScholarship: false,
            prevSlug: null,
            pageViews: null
        }
    }

    static getDerivedStateFromProps(props, state) {
        // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change
        // Store prevSlug in state so we can compare when props change.
        // Clear out previously-loaded data (so we don't render stale stuff).
        const { match: { params: { slug } } } = props;
        const { prevSlug } = state;
        if (slug !== prevSlug) {
            return {
                ...state,
                prevSlug: slug,
                scholarship: null,
                pageViews: null,
            };
        }

        // No state update necessary
        return null;
    }

    componentDidMount() {
        this.loadContent();

    }
    componentDidUpdate(prevProps, prevState) {
        const { scholarship, errorLoadingScholarship } = this.state;
        if (scholarship === null && !errorLoadingScholarship) {
            this.loadContent();
        }
    }

    loadContent = () => {

        const { match: { params: { slug } }, userProfile, location } = this.props;
        ScholarshipsAPI.getSlug(slug)
            .then(res => {
                const { scholarship, contributors, awards } = res.data;
                const { owner_detail } = scholarship;

                this.setState({ scholarship, contributors, awards, scholarshipUserProfile: owner_detail }, () => {
                    addStyleClasstoTables(".content-detail");
                    // add CTA classes to all buttons
                    $(".scholarship-cta-buttons button").addClass("col-md-3 col-sm-12 mt-3");
                    if (location && location.hash) {
                        scrollToElement(location.hash);
                    }
                });

                const { is_not_available } = scholarship;

                if (is_not_available) {
                    const notAvailableText = (<p className="text-danger">Scholarship is no longer available</p>);
                    message.error(notAvailableText, 3);
                }
                /*
                    Save the most recently viewed scholarship to local storage so that if user gets redirected to register/login page
                    they can easily get back here.
                */
                localStorage.setItem("mostRecentlyViewedContentName", scholarship.name);
                localStorage.setItem("mostRecentlyViewedContentSlug", location.pathname);

                this.findExistingApplication();

                AnalyticsService
                    .savePageView(scholarship, userProfile)
                    .then(() => {
                        if (!userProfile) {
                            const guestPageViews = guestPageViewsIncrement();
                            this.setState({ pageViews: { guestPageViews } });
                        }
                    });
            })
            .catch((err) => {
                let errorMessage = (<div className="text-center">
                    <h1>Error Getting Scholarship.</h1>
                    <h3>
                        Please try again later
                    </h3>
                </div>);
                if (err.response && err.response.status === 404) {
                    errorMessage = (<div className="text-center">
                        <h1>Scholarship Not Found</h1>
                    </div>);
                }
                this.setState({ errorLoadingScholarship: errorMessage });

            })
            .finally(() => {
                this.setState({ isLoadingScholarship: false });
                this.setState({ prevSlug: slug });
            });
    };

    /**
     * If user is logged in, check the database for an existing application. If not logged in, check local storage
     * for an application.
    */

    findExistingApplication = () => {
        const { userProfile } = this.props;
        const { scholarship } = this.state;

        if (userProfile) {
            this.findExistingApplicationRemotely(scholarship, userProfile);
        }

    };

    findExistingApplicationRemotely = (scholarship, userProfile) => {

        this.setState({ isLoadingApplication: true });
        ApplicationsAPI
            .doesApplicationExist(userProfile.user, scholarship.id)
            .then(res => {
                const { data: { exists, application } } = res;
                if (exists) {
                    this.setState({ currentUserScholarshipApplication: application });
                }
            })
            .catch((err) => {
                console.log({ err });
            })
            .finally(() => {
                this.setState({ isLoadingApplication: false });
            });
    };

    getOrCreateApplication = () => {
        const { userProfile } = this.props;

        if (userProfile) {
            this.getOrCreateApplicationRemotely();
        } else {
            this.getOrCreateApplicationLocally();
        }
    };


    getOrCreateApplicationRemotely = () => {
        const { userProfile } = this.props;
        const { scholarship } = this.state;
        ApplicationsAPI.getOrCreate({ scholarship: scholarship.id, user: userProfile.user })
            .then(res => {

                const { data: { application } } = res;

                this.props.history.push(`/application/${application.id}`);
            })
            .catch(err => {
                console.log({ err });
            })

    };


    getOrCreateApplicationLocally = () => {
        const { scholarship } = this.state;

        ApplicationsAPI.getOrCreateLocally(scholarship);

        this.props.history.push(`/application/local/scholarship_${scholarship.id}`);

    };


    render() {

        const { isLoadingScholarship, scholarship, awards,
            errorLoadingScholarship, scholarshipUserProfile,
            pageViews, currentUserScholarshipApplication, isLoadingApplication, contributors } = this.state;
        const { userProfile } = this.props;
        const { location: { pathname } } = this.props;

        if (errorLoadingScholarship) {
            return errorLoadingScholarship;
        }

        if (!scholarship) {
            return (
                <Loading
                    isLoading={isLoadingScholarship}
                    title={'Loading Scholarships..'} />)
        }
        const { id, name, description, funding_amount,
            slug, img_url, criteria_info, scholarship_url, form_url, is_not_available, deadline } = scholarship;
        let fundingString = formatCurrency(Number.parseInt(funding_amount), true);

        if (Number.parseInt(funding_amount) === 0) {
            fundingString = "varies";
        }

        let scholarshipDateMoment = moment(deadline);
        const isScholarshipDeadlinePassed = scholarshipDateMoment.diff(moment()) < 0;

        let applyToScholarshipButton = null;
        if (isScholarshipDeadlinePassed && !currentUserScholarshipApplication) {
            applyToScholarshipButton = null;
        } else if (!userProfile) {
            applyToScholarshipButton = (<Button type="primary" size="large"
                disabled={isLoadingApplication}>
                <Link to={`/register?redirect=${pathname}&applyNow=1`}>
                    Apply Now
                </Link>
            </Button>)
        } else {
            applyToScholarshipButton = (<Button type="primary" size="large"
                onClick={this.getOrCreateApplication}
                disabled={isLoadingApplication}>
                {isLoadingApplication ? "Checking for existing Application..." : "Apply Now"}
            </Button>);

            if (currentUserScholarshipApplication) {
                applyToScholarshipButton = (
                    <Button type="primary" size="large" disabled={isLoadingApplication}>
                        <Link to={`/application/${currentUserScholarshipApplication.id}`}>
                            {currentUserScholarshipApplication.is_submitted ||
                                isScholarshipDeadlinePassed ? "View Application" : "Continue Application"}
                        </Link>
                    </Button>)
            } else if (scholarshipUserProfile && userProfile.user === scholarshipUserProfile.user) {
                applyToScholarshipButton = null;
            }
        }

        let redditUrlComponent;
        if (scholarship.reddit_url) {
            redditUrlComponent = (
                <div>
                    <hr />
                    <h3>Questions about this scholarship?</h3>
                    Ask on the{' '}
                    <Link to={scholarship.reddit_url}>
                        Reddit post for this scholarship
                    </Link>
                    {' '}on{' '}
                    <Link to={`https://reddit.com/r/atila`}>
                        r/atila.
                    </Link>
                    <hr />
                </div>
            )
        }

        return (
            <React.Fragment>
                <HelmetSeo content={genericItemTransform(scholarship)} />

                {pageViews &&
                    <AtilaPointsPaywallModal pageViews={pageViews} />
                }
                <div className="content-detail container mt-5">
                    <div className="row">
                        <div className="col-12">
                            <h1>
                                {name}{' '}
                                {scholarship.is_atila_direct_application &&
                                    <>
                                        <AtilaDirectApplicationsPopover
                                            title="This is a verified Atila Direct Application Scholarship"
                                            children={<img
                                                alt="user profile"
                                                style={{ width: '25px' }}
                                                className="rounded-circle"
                                                src={verifiedBadge} />} />

                                        <div style={{ fontSize: "15px", fontWeight: "normal" }} className="text-center mb-3">
                                            (Hint: Hover over or click the blue check to learn why this scholarship has a blue check.)
                                        </div>
                                    </>
                                }
                            </h1>

                            <img
                                style={{ maxHeight: '300px', width: 'auto' }}
                                src={img_url}
                                className="center-block"
                                alt={name} />
                            <hr />
                        </div>


                        <div className="col-md-8">
                            <div className="scholarship-description">
                                <h3>Description</h3>
                                <p style={{ "whiteSpace": "pre-line" }}>
                                    {description}
                                </p>
                                <ScholarshipExtraCriteria scholarship={scholarship} />
                            </div>
                            <hr />
                            {((scholarshipUserProfile && userProfile &&
                                userProfile.user === scholarshipUserProfile.user)
                                || (userProfile && userProfile.is_atila_admin))
                                &&
                                <React.Fragment>

                                    <Link to={`/scholarship/edit/${slug}`}>
                                        Edit Scholarship
                                    </Link><br />
                                    {scholarship.is_atila_direct_application &&
                                        <Link to={`/scholarship/${scholarship.id}/manage`}>
                                            Manage Applications
                                        </Link>
                                    }
                                </React.Fragment>
                            }

                            <div className="scholarship-cta-buttons row ml-0">

                                {scholarship.is_atila_direct_application &&
                                    <React.Fragment>
                                        {applyToScholarshipButton && <React.Fragment>
                                            {applyToScholarshipButton}
                                        </React.Fragment>}

                                        <Button size="large">
                                            <Link to={`/scholarship/${slug}/questions`}>
                                                View Application Form
                                            </Link>
                                        </Button>

                                        {scholarship.learn_more_url &&
                                            <React.Fragment>
                                                <Button size="large">
                                                    <a href={scholarship.learn_more_url}
                                                        target="_blank"
                                                        rel='noopener noreferrer'>
                                                        {scholarship.learn_more_title || `Learn More about ${scholarship.name}`}
                                                    </a>
                                                </Button>
                                            </React.Fragment>
                                        }
                                    </React.Fragment>
                                }

                                {!scholarship.is_atila_direct_application &&
                                    <React.Fragment>
                                        {scholarship_url &&
                                            <Button size="large"
                                                className="mt-3">
                                                <a href={scholarship_url}
                                                    target="_blank"
                                                    rel='noopener noreferrer'>
                                                    Visit Scholarship Website
                                                </a>
                                            </Button>
                                        }
                                        {form_url &&
                                            <Button size="large" className="mt-3">
                                                <a href={form_url} target="_blank" rel="noopener noreferrer">
                                                    View Scholarship Application
                                                </a> <br />
                                            </Button>
                                        }
                                    </React.Fragment>
                                }
                            </div>
                            <div>
                                <hr />
                                <ScholarshipShareSaveButtons scholarship={scholarship} />
                                {scholarship && <ApplicationsLocal scholarship={scholarship} />}
                                {scholarship.is_blind_applications && <BlindApplicationsExplanationMessage />}
                                {scholarship.is_referral_bonus_eligible && <ReferralBonusScholarshipExplanationMessage />}
                            </div>


                            <div className="font-weight-bold">
                                <ScholarshipDeadlineWithTags scholarship={scholarship} addDeadlineToCalendar={true} />
                                <br />
                                <ReportIncorrectInfo scholarship={scholarship} />
                            </div>

                            {redditUrlComponent}

                            <div className="font-weight-bold">

                                {scholarshipUserProfile &&
                                    <React.Fragment>
                                        Added by:
                                        <div className="bg-light mb-3 p-1" style={{ width: '500px' }}>
                                            <Link to={`/profile/${scholarshipUserProfile.username}`} >
                                                <img
                                                    alt="user profile"
                                                    style={{ height: '50px', maxWidth: 'auto' }}
                                                    className="rounded-circle py-1 pr-1"
                                                    src={scholarshipUserProfile.profile_pic_url} />
                                                {scholarshipUserProfile.first_name} {scholarshipUserProfile.last_name}
                                            </Link>&nbsp;
                                            {contributors.is_owner === scholarshipUserProfile.is_owner && <Tag color="green">{' '}Creator</Tag>}
                                        </div>

                                        Total Funding: {fundingString}
                                        <AwardDetail awards={awards} />
                                        {scholarship.is_atila_direct_application && !isScholarshipDeadlinePassed &&
                                            <div className="mb-3">
                                                <Button type="primary" size="large" className="mt-3"
                                                    style={{ fontSize: "18px", width: "150px", height: "75px" }}>
                                                    <Link to={`/scholarship/${slug}/contribute`}>
                                                        Contribute
                                                    </Link>
                                                </Button><br /><br />
                                            </div>
                                        }
                                    </React.Fragment>
                                }
                            </div>

                            {contributors && contributors.length > 1 &&
                                <div>
                                    <h3 className="text-left">Contributors</h3>
                                    <UserProfilesCards userProfiles={contributors} userKey="id" />
                                </div>

                            }
                            {is_not_available &&
                                <Alert
                                    type="error"
                                    message="This scholarship is no longer being offered."
                                    className="mb-3"
                                    style={{ maxWidth: '300px' }}
                                />
                            }
                            {isScholarshipDeadlinePassed &&
                                <React.Fragment>
                                    <hr />
                                    <div className="my-3" id="finalists">
                                        <ScholarshipFinalists itemType={"essay"} id={scholarship.id} title="Finalists" />
                                    </div>
                                </React.Fragment>
                            }

                            {/*todo find a way to secure against XSS: https://stackoverflow.com/a/19277723*/}
                            <hr />
                            <div dangerouslySetInnerHTML={{ __html: criteria_info }} />
                            <br />
                        </div>
                        <RelatedItems
                            className="col-md-4"
                            id={id}
                            itemType={'scholarship'} />

                        {!userProfile &&
                            <React.Fragment>
                                <Button type="primary" className="font-size-larger col-12 mt-1" style={{ fontSize: "25px" }}>
                                    <Link to="/register">
                                        Register for Free to see more Scholarships
                                    </Link>
                                </Button>
                                <Button type="primary" className="font-size-larger col-12 my-3" style={{ fontSize: "25px" }}>
                                    <Link to="/start">
                                        Start a Scholarship
                                    </Link>
                                </Button>
                            </React.Fragment>
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipDetail);