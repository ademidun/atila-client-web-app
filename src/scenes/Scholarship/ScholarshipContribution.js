import React from 'react'
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";

import {Button, Input, Steps} from "antd";
import UserProfileAPI from "../../services/UserProfileAPI";
import PaymentSend from "../Payment/PaymentSend/PaymentSend";
import {UserProfilePropType} from "../../models/UserProfile";
import Register from "../../components/Register";
import FileInput from "../../components/Form/FileInput";
import {DEFAULT_SCHOLARSHIP_CONTRIBUTOR, SCHOLARSHIP_CONTRIBUTION_EXAMPLE_IMAGE} from "../../models/Scholarship";
import ScholarshipContributionProfilePictureChooser from "./ScholarshipContributionProfilePictureChooser";
import {ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_CONTRIBUTE_SCHOLARSHIP} from "../../models/Constants";
import {isValidEmail} from "../../services/utils";
import ReferredByInput from "../../components/ReferredByInput";

const { Step } = Steps;


class ScholarshipContribution extends React.Component {
    constructor(props) {
        super(props);

        const { userProfile } = props;
        /**
         * Usually you might use something like: Object.assign({}, DEFAULT_SCHOLARSHIP_CONTRIBUTOR)
         * to avoid contributor values persisting between different re-renderings
         * as was done in DEFAULT_SCHOLARSHIP (see: ScholarshipAddEdit.js).
         * But in DEFAULT_SCHOLARSHIP the problem came when we wanted to add different users, in this use case
         * it's more likely that a user who contributed towards one scholarship, is likely to be the same user
         * that contributes to another or the same scholarship. So persisting state values in this scenario,
         * is actually an advantage.
         */
        const defaultContributor = DEFAULT_SCHOLARSHIP_CONTRIBUTOR;

        // Pre-fill the contributor information with the logged-in user profile details.
        if (userProfile) {
            Object.keys(defaultContributor).forEach(defaultContributorKey => {
                if ( userProfile[defaultContributorKey]) {
                    defaultContributor[defaultContributorKey] = userProfile[defaultContributorKey];
                }
            });
        }


        let referredBy = localStorage.getItem('referred_by') || '';
        if (!defaultContributor.referred_by) {
            defaultContributor.referred_by = referredBy
        }


        this.state = {
            scholarship: null,
            scholarshipOwner: null,
            isLoadingScholarship: true,
            pageNumber: 0,
            contributor: defaultContributor,
            invalidInput: !defaultContributor.funding_amount,
            showRegistrationForm: true,
            fundingComplete: false,
            referredByUserProfile: null,
        }
    }

    componentDidMount() {
        const { match : { params : { slug }}} = this.props;

        ScholarshipsAPI
            .getSlug(slug)
            .then(res => {
                const { scholarship } = res.data;
                this.setState({ scholarship });

                // TODO, scholarship serializer should return the userprofile information inside scholarship.owner
                // instead of only returning the userprofile PK.

                UserProfileAPI.get(scholarship.owner)
                    .then(res => {
                        this.setState({ scholarshipOwner: res.data });
                    })
            })
            .catch(err => {
                console.log({err})
            })
            .finally(() => {
                this.setState({isLoadingScholarship: false});
            })
    };

    changePage = (pageNumber) => {
        // scroll to the top of page on each navigation
        window.scrollTo(0, 0);
        this.setState({pageNumber});
    };

    updateContributorInfo = (event) => {
        if (event.preventDefault) {
            event.preventDefault();
        }
        let { contributor, pageNumber } = this.state;
        let { is_anonymous } = contributor;
        let invalidInput = null;
        let value = event.target.value;
        let eventName = event.target.name;
        const keyCode = event.code || event.key;

        if (eventName === "funding_amount") {
            value = Number.parseInt(value)
        }

        if (eventName === "email") {
            if (value && !isValidEmail(value)) {
                // Don't print a full invalid input statement because user might still be typing
                invalidInput = true;
            }
        }
        // If the user types a first name or last name then that implies they are not anonymous.
        if (eventName === "first_name" || eventName === "last_name") {
            is_anonymous = !value;
        }

        contributor = {
            ...contributor,
            is_anonymous,
            [eventName]: value
        };
        if (contributor && contributor.funding_amount < ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_CONTRIBUTE_SCHOLARSHIP) {
            invalidInput = `Minimum contribution amount is $${ATILA_DIRECT_APPLICATION_MINIMUM_FUNDING_AMOUNT_CONTRIBUTE_SCHOLARSHIP}.`;
        }

        this.setState({ contributor, invalidInput }, () => {
            if (!invalidInput && keyCode === 'Enter'){
                this.changePage(pageNumber+1);
            }
        });
    };

    contributeAnonymously = () => {

        let { contributor } = this.state;

        contributor = {
            ...contributor,
            is_anonymous: true,
            first_name: "",
            last_name: "",
        };
        this.setState({ contributor });

    };

    onFundingComplete = (fundingCompletionData, scholarshipContributionPages) => {
        // TODO implement some logic that should happen after a scholarship has been funded
        const { contributor } = fundingCompletionData;

        // set pageNumber to the last page of scholarshipContributionPages
        this.setState({contributor, pageNumber: scholarshipContributionPages.length - 1, fundingComplete: true});

        setTimeout(()=> {
            if (document.getElementById("hide-after-3-seconds")) {
                document.getElementById("hide-after-3-seconds").style.display = "none";
            }
        }, 3000)

    };

    toggleShowRegistrationForm = () => {
        const { showRegistrationForm } = this.state;

        this.setState({showRegistrationForm: !showRegistrationForm});
    };

    selectReferredByUserProfile = (referredByUserProfile) => {
        const newContributor = { ...this.state.contributor, referred_by: referredByUserProfile.username }
        this.setState({contributor: newContributor, referredByUserProfile});
    };

    amountPageRender = () => {
        const { scholarship, contributor } = this.state;
        return (
            <div className="col-12">
                <h1>
                    How much would you like to contribute to {scholarship.name}?
                </h1>

                <Input value={contributor.funding_amount}
                       prefix="$"
                       name="funding_amount"
                       placeholder="Funding Amount"
                       className="col-12"
                       type="number"
                       min="0"
                       step="1"
                       onChange={this.updateContributorInfo}/>
            </div>
        )
    }

    namePageRender = () => {
        const { contributor, scholarshipOwner, pageNumber } = this.state;

        return (
            <div className="col-12">
                <h1>
                    Let{' '}{scholarshipOwner ? scholarshipOwner.first_name: "the Scholarship sponsor"}{' '}
                    know who is contributing
                </h1>

                <Input value={contributor.first_name}
                       name="first_name"
                       placeholder="First name"
                       className="col-12 mb-3"
                       onChange={this.updateContributorInfo}/>

                <Input value={contributor.last_name}
                       name="last_name"
                       placeholder="Last name"
                       className="col-12"
                       onChange={this.updateContributorInfo}/>
                <hr/>

                <Button className="float-right col-md-6" type="link"
                        onClick={() => {
                            this.contributeAnonymously();
                            this.changePage(pageNumber+1);
                        }}>
                    Skip to contribute anonymously
                </Button>
                <h3>Add a Picture of yourself to go with your donation</h3>
                <FileInput title={"Profile Picture"}
                           type={"image"}
                           keyName={"profile_pic_url"}
                           filePath={`user-profile-pictures-contributors`}
                           onChangeHandler={this.updateContributorInfo} />
                {contributor.profile_pic_url &&
                <>
                    <img src={contributor.profile_pic_url}
                         alt={contributor.first_name}
                         style={{width: "150px"}}
                         className="rounded-circle shadow my-3"/>
                </>
                }

                <h3 className="my-3">Or Select your Preferred image</h3>
                <ScholarshipContributionProfilePictureChooser contributor={contributor}
                                                              onSelectedPicture={this.updateContributorInfo}/>
            </div>
        )
    }

    emailPageRender = () => {
        const { contributor, referredByUserProfile } = this.state;

        // Show the referred by field if there is no logged in user or there is no referred by field.
        // const showReferredByInput = !userProfile || !contributor.referred_by
        // Temporarily hide showReferredByInput to avoid complicating contribution flow and the field is not
        // currently being used.
        const showReferredByInput = false;

        return (
            <div className="col-12">
                <h1>
                    Email to receive your funding confirmation
                </h1>

                <Input value={contributor.email}
                       name="email"
                       placeholder="Email"
                       className="col-12"
                       onChange={this.updateContributorInfo}/>

                {showReferredByInput &&
                <>
                    <br />
                    <br />
                    <h2>Were you referred to contribute by a user? (Optional)</h2>
                    <ReferredByInput username={contributor.referred_by}
                                     onSelect={this.selectReferredByUserProfile}
                                     referredByUserProfile={referredByUserProfile} />
                </>
                }
            </div>
        )
    }

    render () {
        const { userProfile } = this.props;
        const { isLoadingScholarship, scholarship, pageNumber, contributor,
            invalidInput, showRegistrationForm, fundingComplete } = this.state;

        let scholarshipContributionPages = [
            {
                title: 'Amount',
                render: this.amountPageRender,
            },
            {
                title: 'Name',
                render: this.namePageRender,
            },
            {
                title: 'Email',
                render: this.emailPageRender,
            },
            {
                title: 'Payment',
                render: null,
            },
            {
                title: 'Complete',
                render: null,
            },
        ];

        const scholarshipSteps = (<Steps current={pageNumber} onChange={(current) => this.changePage(current+1)}>
            { scholarshipContributionPages.map(item => {

                let disableStep = invalidInput || (!fundingComplete && (["Payment", "Complete"].includes(item.title)
                    && !isValidEmail(contributor.email)));

                if(item.title === "Complete") {
                    disableStep = !fundingComplete;
                }
                /*
                * Cast explicitly to boolean for example if disableStep has the value of invalidInput,
                * and invalidInput is a string, we need to cast it to boolean. Otherwise, ant design doesn't show
                * the disabled mouse cursor icon on hover over disabled steps.
                * */
                disableStep = !!disableStep;

                return (<Step key={item.title} title={item.title} disabled={disableStep} />)
            })}
        </Steps>);

        if (isLoadingScholarship || !scholarship) {
            return (<Loading title={`Loading Form`} className='mt-3' />)
        }

        const navigationButtons = (
            <div className="row">

            {pageNumber > 0 &&
            <Button className="float-left col-md-6 mb-3"
                    onClick={() => this.changePage(pageNumber-1)}>Back</Button>}
            {pageNumber === 0 &&
            <Button className="float-left col-md-6 mb-3">
                <Link to={`/scholarship/${scholarship.slug}`}>
                    Back
                </Link>
            </Button>}

            {pageNumber < scholarshipContributionPages.length - 1 &&
            <Button className="float-right col-md-6 mb-3"
                    type="primary"
                    onClick={() => this.changePage(pageNumber+1)}
                    disabled={invalidInput
                    || (pageNumber === 1 && !contributor.first_name)
                    || (pageNumber === 2 && !contributor.email)
                    || (pageNumber === 3 && !fundingComplete)}>
                Next
            </Button>}
        </div>
        )


        return (
            <div className="container mt-5 text-center">
                {scholarshipSteps}
                <div className="row my-3">
                    {pageNumber <= 2 &&
                        scholarshipContributionPages[pageNumber].render()
                    }
                    {pageNumber >= 3 &&
                    <div className="col-12">
                        {pageNumber === 4 &&
                            <div>
                                <h1>Share your Contribution Image</h1>
                                {contributor.funding_confirmation_image_url &&
                                    <>
                                    <div className="col-12">
                                        <img src={contributor.funding_confirmation_image_url}
                                             style={{width: "100%"}} alt={`Scholarship Contribution confirmation for ${contributor.first_name}`} />
                                             {/*
                                                After 3 seconds, hide the message that tells the user the image may take some time to load.
                                                The images are generated using htmlcsstoimage.com which can take about 3 seconds to load.
                                                This message lets the user know to stay on the page and not navigate away.
                                             */}
                                             <p id="hide-after-3-seconds">Your confirmation image may take a few seconds to display, please wait...</p>
                                    </div>
                                    </>
                                }
                                {contributor.is_anonymous &&
                                    <div>
                                        <h6 className="text-muted text-center">
                                            No image to share since you're anonymous, but if you decide to share your name for future scholarships,
                                        you can get an image like this:
                                        </h6>
                                        <div className="col-12">
                                            <img src={SCHOLARSHIP_CONTRIBUTION_EXAMPLE_IMAGE}
                                                 style={{width: "70%"}} alt={`Scholarship Contribution confirmation for ${contributor.first_name}`} />
                                        </div>
                                    </div>
                                }
                                <div className="col-12 text-center mb-3">
                                    <a target="_blank" rel="noopener noreferrer" href={contributor.is_anonymous ? SCHOLARSHIP_CONTRIBUTION_EXAMPLE_IMAGE : contributor.funding_confirmation_image_url}>
                                        View Image (Right click or hold on mobile to save image)
                                    </a>
                                </div>
                                <div className="col-12 text-center mb-3">
                                    <Link to={`/scholarship/${scholarship.slug}`}>
                                        View Scholarship: {scholarship.name}
                                    </Link>
                                </div>
                                {!userProfile &&
                                <div className="col-12 text-center mb-3">
                                    <h1>Optional: Create an Account</h1> <br/>
                                    <p className="text-muted">
                                        Creating an account will allow you to view all your contributions
                                        on Atila and request being added as a reviewer to applications for this
                                        scholarship.
                                    </p>
                                    <Button onClick={this.toggleShowRegistrationForm} type="link">
                                        {showRegistrationForm ? 'Hide ' : 'Show '} Registration Form
                                    </Button>
                                    {showRegistrationForm &&
                                    <Register location={this.props.location}
                                              userProfile={contributor}
                                              disableRedirect={true}/>
                                    }
                                </div>
                                }

                            </div>
                        }
                        {pageNumber === 3 &&
                        <h1>
                            Enter Payment Details
                        </h1>
                        }
                        <PaymentSend scholarship={scholarship}
                                     onFundingComplete={data => this.onFundingComplete(data, scholarshipContributionPages)}
                                     contributorFundingAmount={contributor.funding_amount}
                                     contributor={contributor} />
                    </div>
                    }

                    {invalidInput &&

                    <p className="text-danger">
                        {invalidInput}
                    </p>

                    }
                </div>

                {navigationButtons}
            
            </div>
        )
    }
}

ScholarshipContribution.defaultProps = {
    userProfile: null
};
ScholarshipContribution.propTypes = {
    // redux
    userProfile: UserProfilePropType
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};

export default withRouter(connect(mapStateToProps)(ScholarshipContribution));
