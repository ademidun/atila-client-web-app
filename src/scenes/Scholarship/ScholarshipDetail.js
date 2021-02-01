import React from 'react';
import {Link} from "react-router-dom";
import moment from "moment";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {formatCurrency, genericItemTransform, guestPageViewsIncrement, scrollToElement} from "../../services/utils";
import Loading from "../../components/Loading";
import RelatedItems from "../../components/RelatedItems";
import {connect} from "react-redux";
import AnalyticsService from "../../services/AnalyticsService";
import ScholarshipShareSaveButtons from "./ScholarshipShareSaveButtons";
import HelmetSeo from "../../components/HelmetSeo";
import UserProfileAPI from "../../services/UserProfileAPI";
import ApplicationsAPI from "../../services/ApplicationsAPI";
import AtilaPointsPaywallModal from "../../components/AtilaPointsPaywallModal";
import ScholarshipExtraCriteria from "./ScholarshipExtraCriteria";
import ScholarshipDeadlineWithTags from "../../components/ScholarshipDeadlineWithTags";
import {Alert, Button, message} from 'antd';
import verifiedBadge from '../../components/assets/verified.png';
import {AtilaDirectApplicationsPopover, BlindApplicationsExplanationMessage} from "../../models/Scholarship";
import ScholarshipFinalists, {UserProfilesCards} from "./ScholarshipFinalists";

class ScholarshipDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarship: null,
            contributors: null,
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
        const { match : { params : { slug }} } = props;
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

        const { match : { params : { slug }}, userProfile, location } = this.props;
        ScholarshipsAPI.getSlug(slug)
            .then(res => {
                const { scholarship, contributors } = res.data;
                this.setState({ scholarship, contributors }, () => {
                    if (location && location.hash) {
                        scrollToElement(location.hash);
                    }
                });

                const { is_not_available  } = scholarship;

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
                        if(!userProfile) {
                            const guestPageViews = guestPageViewsIncrement();
                            this.setState({pageViews: {guestPageViews}});
                        }
                    });
                UserProfileAPI.get(scholarship.owner)
                    .then(res => {
                        this.setState({ scholarshipUserProfile: res.data });
                    })
            })
            .catch((err) => {
                let errorMessage = (<div className="text-center">
                    <h1>Error Getting Scholarship.</h1>
                    <h3>
                        Please try again later
                    </h3>
                </div>);
                if(err.response && err.response.status === 404) {
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

        if(userProfile) {
            this.findExistingApplicationRemotely(scholarship, userProfile);
        } else {
            this.findExistingApplicationLocally(scholarship);
        }

    };

    findExistingApplicationRemotely = (scholarship, userProfile) => {

        this.setState({isLoadingApplication: true});
        ApplicationsAPI
            .doesApplicationExist(userProfile.user, scholarship.id)
            .then(res => {
                const { data: { exists, application } } = res;
                if (exists) {
                    this.setState({ currentUserScholarshipApplication: application });
                }
            })
            .catch((err) => {
                console.log({err});
            })
            .finally(() => {
                this.setState({isLoadingApplication: false});
            });
    };

    findExistingApplicationLocally = (scholarship) => {
        const localApplicationID = `local_application_scholarship_id_${scholarship.id}`;
        if (localStorage.getItem(localApplicationID)) {
            this.setState({ currentUserScholarshipApplication: {id: `local/scholarship_${scholarship.id}`} })
        }
    }

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
        ApplicationsAPI.getOrCreate({scholarship: scholarship.id, user: userProfile.user})
            .then(res=>{

                const {data: { application }} = res;

                this.props.history.push(`/application/${application.id}`);
            })
            .catch(err => {
                console.log({err});
            })

    };


    getOrCreateApplicationLocally = () => {
        const { scholarship } = this.state;

        ApplicationsAPI.getOrCreateLocally(scholarship);

        this.props.history.push(`/application/local/scholarship_${scholarship.id}`);

    };


    render() {

        const { isLoadingScholarship, scholarship,
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
        const isScholarshipDeadlinePassed = scholarshipDateMoment.diff(moment(), 'days') < 0;

        let applyToScholarshipButton = (<Button type="primary" size="large"
                                                className="mt-3" style={{fontSize: "20px", width: "300px"}}
                                                disabled={isLoadingApplication}>
                                        <Link to={`/register?redirect=${pathname}&applyNow=1`}>
                                        {isLoadingApplication ? "Checking for existing Application..." : "Apply Now"}
                                        </Link>
                                        </Button>);

        if (userProfile) {
            applyToScholarshipButton = (<Button type="primary" size="large"
                                                className="mt-3" style={{fontSize: "20px", width: "300px"}}
                                                onClick={this.getOrCreateApplication}
                                                disabled={isLoadingApplication}>
            {isLoadingApplication ? "Checking for existing Application..." : "Apply Now"}
        </Button>);
        }

        if(currentUserScholarshipApplication) {
            applyToScholarshipButton = (
                <Button type="primary" size="large"
                        className="mt-3" style={{fontSize: "20px", width: "300px"}} disabled={isLoadingApplication}>
                <Link to={`/application/${currentUserScholarshipApplication.id}`}>
                    {currentUserScholarshipApplication.is_submitted || isScholarshipDeadlinePassed ? "View Application" : "Continue Application"}
                </Link>
            </Button>)
        } else if (isScholarshipDeadlinePassed) {
            applyToScholarshipButton = null;
        }

        if(scholarshipUserProfile && userProfile &&
            userProfile.user === scholarshipUserProfile.user) {
            applyToScholarshipButton = null;
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
                                                style={{ width:'25px' }}
                                                className="rounded-circle"
                                                src={verifiedBadge} />} />

                                        <div style={{fontSize: "15px", fontWeight: "normal"}} className="text-center mb-3">
                                            (Hint: Hover over or click the blue check to learn why this scholarship has a blue check.)
                                        </div>
                                        </>
                                        }
                            </h1>

                            <img
                                style={{ maxHeight: '300px', width: 'auto'}}
                                src={img_url}
                                className="center-block"
                                alt={name} />
                        </div>


                        <div className="col-md-8">
                            {scholarship_url && !scholarship.is_atila_direct_application &&
                            <React.Fragment>
                                <a href={scholarship_url} target="_blank" rel="noopener noreferrer">
                                    Visit Scholarship Website
                                </a> <br/>
                            </React.Fragment>}
                            {form_url && !scholarship.is_atila_direct_application &&
                            <React.Fragment>
                                <a href={form_url} target="_blank" rel="noopener noreferrer">
                                    View Scholarship Application
                                </a> <br/>
                            </React.Fragment>}
                            {((scholarshipUserProfile && userProfile &&
                            userProfile.user === scholarshipUserProfile.user)
                            || (userProfile && userProfile.is_atila_admin))
                            &&
                            <React.Fragment>

                                <Link to={`/scholarship/edit/${slug}`}>
                                    Edit Scholarship
                                </Link><br/>
                                {scholarship.is_atila_direct_application &&
                                <Link to={`/scholarship/${scholarship.id}/manage`}>
                                    Manage Applications
                                </Link>
                                }
                            </React.Fragment>
                            }
                            {scholarship.is_atila_direct_application &&
                            <div>
                                <Link to={`/scholarship/${slug}/questions`}>
                                    View Application Form
                                </Link>
                                <br />
                                {applyToScholarshipButton && <React.Fragment>
                                    {applyToScholarshipButton} <br/>
                                    </React.Fragment>}
                                {scholarship.learn_more_url && 
                                <React.Fragment>
                                <Button size="large"
                                            className="mt-3" style={{fontSize: "20px", width: "300px"}}>
                                    <a  href={scholarship.learn_more_url} 
                                        target="_blank" 
                                        rel='noopener noreferrer'>
                                        {scholarship.learn_more_title || `Learn More about ${scholarship.name}`}
                                    </a>
                                </Button><br/>

                                </React.Fragment>
                                
                                }
                                {scholarship.is_blind_applications && <BlindApplicationsExplanationMessage />}
                            </div>
                            }

                            <br/><br/>
                            {
                                scholarshipUserProfile &&
                                <React.Fragment>
                                    Added by:
                                    <div className="bg-light mb-3 p-1" style={{ width: '250px' }}>
                                        <Link to={`/profile/${scholarshipUserProfile.username}`} >
                                            <img
                                                alt="user profile"
                                                style={{ height: '50px', maxWidth: 'auto' }}
                                                className="rounded-circle py-1 pr-1"
                                                src={scholarshipUserProfile.profile_pic_url} />
                                            {scholarshipUserProfile.first_name} {scholarshipUserProfile.last_name}
                                        </Link>
                                    </div>
                                </React.Fragment>
                            }
                            <p className="font-weight-bold">
                                <ScholarshipDeadlineWithTags scholarship={scholarship} />
                                <br/>
                                Amount: {fundingString}
                            </p>
                            {scholarship.is_atila_direct_application  && !isScholarshipDeadlinePassed &&
                                <div className="mb-3">
                                    <Button type="primary">
                                        <Link to={`/scholarship/${slug}/contribute`}>
                                            Contribute
                                        </Link>
                                    </Button><br/>
                                </div>
                            }
                            {contributors && contributors.length > 0 &&
                                <div>
                                    <h3 className="text-center">Contributors</h3>
                                    <UserProfilesCards userProfiles={contributors} userKey="id" />
                                </div>

                            }
                            {is_not_available &&
                            <Alert
                                type="error"
                                message="This scholarship is no longer being offered."
                                className="mb-3"
                                style={{maxWidth: '300px'}}
                            />
                            }
                            <ScholarshipShareSaveButtons scholarship={scholarship} />
                            <hr />
                            <div className="my-3">
                                <h3>Description</h3>
                                <p>
                                    {description}
                                </p>
                                <ScholarshipExtraCriteria scholarship={scholarship} />
                            </div>
                            {isScholarshipDeadlinePassed &&
                                <div className="my-3" id="finalists">
                                    <ScholarshipFinalists itemType={"essay"} id={scholarship.id} title="Finalists" />
                                </div>
                            }

                            {/*todo find a way to secure against XSS: https://stackoverflow.com/a/19277723*/}
                            <hr />
                            <div dangerouslySetInnerHTML={{__html: criteria_info}} />
                        </div>
                        <RelatedItems
                            className="col-md-4"
                            id={id}
                            itemType={'scholarship'} />

                        {!userProfile  &&
                        <React.Fragment>
                            <Button type="primary" className="font-size-larger col-12 mt-1" style={{fontSize: "25px"}}>
                                <Link to="/register">
                                    Register for Free to see more Scholarships
                                </Link>
                            </Button>
                            <Button type="primary" className="font-size-larger col-12 my-3" style={{fontSize: "25px"}}>
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