import React from 'react';
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {Link} from "react-router-dom";
import {formatCurrency, genericItemTransform, guestPageViewsIncrement} from "../../services/utils";
import Loading from "../../components/Loading";
import RelatedItems from "../../components/RelatedItems";
import {connect} from "react-redux";
import AnalyticsService from "../../services/AnalyticsService";
import ScholarshipShareSaveButtons from "./ScholarshipShareSaveButtons";
import HelmetSeo from "../../components/HelmetSeo";
import UserProfileAPI from "../../services/UserProfileAPI";
import AtilaPointsPaywallModal from "../../components/AtilaPointsPaywallModal";
import ScholarshipExtraCriteria from "./ScholarshipExtraCriteria";
import ScholarshipDeadlineWithTags from "../../components/ScholarshipDeadlineWithTags";
import {Alert, Button, message} from 'antd';


class ScholarshipDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scholarship: null,
            scholarshipUserProfile: null,
            isLoadingScholarship: true,
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
    componentDidUpdate(prevProps, prevState, snapshot) {
        const { scholarship, errorLoadingScholarship } = this.state;
        if (scholarship === null && !errorLoadingScholarship) {
            this.loadContent();
        }
    }

    loadContent = () => {

        const { match : { params : { slug }}, userProfile } = this.props;
        ScholarshipsAPI.getSlug(slug)
            .then(res => {
                const scholarship = res.data;
                this.setState({ scholarship });

                const { is_not_available  } = scholarship;

                if (is_not_available) {
                    const notAvailableText = (<p className="text-danger">Scholarship is no longer available</p>);
                    message.error(notAvailableText, 3);
                }

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
            .catch(() => {
                this.setState({ errorLoadingScholarship: true });
            })
            .finally(() => {
                this.setState({ isLoadingScholarship: false });
                this.setState({ prevSlug: slug });
            });
    };

    goBack = (event) => {
        event.preventDefault();
        this.props.history.goBack();
    };

    startApplication = (event) => {
        const { scholarship } = this.state;

        event.preventDefault();
        this.props.history.push({
            pathname: '/application/',
            search: `?scholarship=${scholarship.id}`
        });

    };

    render() {

        const { isLoadingScholarship, scholarship,
            errorLoadingScholarship,
            pageViews} = this.state;

        const { userProfile } = this.props;

        if (errorLoadingScholarship) {
            return (<div className="text-center">
                <h1>Error Getting Scholarship.</h1>
                <h3>
                    Please try again later
                </h3>
            </div>);
        }

        if (!scholarship) {
            return (
                <Loading
                    isLoading={isLoadingScholarship}
                    title={'Loading Scholarships..'} />)
        }
        const { id, name, description, funding_amount,
            slug, img_url, criteria_info, scholarship_url, form_url, is_not_available } = scholarship;
        const fundingString = formatCurrency(Number.parseInt(funding_amount), true);

        return (
            <React.Fragment>
                <HelmetSeo content={genericItemTransform(scholarship)} />

                {pageViews &&
                <AtilaPointsPaywallModal pageViews={pageViews} />
                }
                <div className="content-detail container mt-5">
                    <div className="row">
                        <div className="col-12">
                            <h1>{name}</h1>
                            <img
                                style={{ maxHeight: '300px', width: 'auto'}}
                                src={img_url}
                                className="center-block"
                                alt={name} />
                        </div>

                        <div className="row">
                            <div className="col-md-8">
                                <br />
                                {scholarship_url &&
                                <React.Fragment>
                                    <a href={scholarship_url} target="_blank" rel="noopener noreferrer">
                                        Visit Scholarship Website
                                    </a> <br/>
                                </React.Fragment>}
                                {form_url &&
                                <React.Fragment>
                                    <a href={form_url} target="_blank" rel="noopener noreferrer">
                                        View Scholarship Application
                                    </a> <br/>
                                </React.Fragment>}
                                {userProfile &&
                                <React.Fragment>
                                <Link to={`/scholarship/edit/${slug}`}>
                                    Edit Scholarship
                                </Link>
                                <br/><br/>
                                </React.Fragment>
                                }

                                <Button onClick={this.startApplication} type="primary">
                                    Start Application
                                </Button> <br/>

                                <button onClick={this.goBack} className="btn btn-link pl-0">
                                    Go Back ←
                                </button>
                                <p className="font-weight-bold">
                                    <ScholarshipDeadlineWithTags scholarship={scholarship} />
                                    <br/>
                                    Amount: {fundingString}
                                </p>
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

                                {/*todo find a way to secure against XSS: https://stackoverflow.com/a/19277723*/}
                                <hr />
                                <div dangerouslySetInnerHTML={{__html: criteria_info}} />
                            </div>
                            <RelatedItems
                                className="col-md-4"
                                id={id}
                                itemType={'scholarship'} />
                        </div>
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