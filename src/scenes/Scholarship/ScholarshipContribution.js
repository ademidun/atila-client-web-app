import React from 'react'
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import Loading from "../../components/Loading";

import {Alert, Button, Input, Radio, Select, Space, Steps} from "antd";
import {UserProfilePropType} from "../../models/UserProfile";
import Register from "../../components/Register";
import FileInput from "../../components/Form/FileInput";
import {DEFAULT_SCHOLARSHIP_CONTRIBUTOR} from "../../models/Scholarship";
import ScholarshipContributionProfilePictureChooser from "./ScholarshipContributionProfilePictureChooser";
import {isValidEmail} from "../../services/utils";
import ReferredByInput from "../../components/ReferredByInput";
import {CryptoCurrencies, Currencies, CURRENCY_CODES, ETH} from "../../models/ConstantsPayments";
import CurrencyDisplay from '@atila/web-components-library.ui.currency-display';
import ScholarshipCryptoPaymentForm from './ScholarshipCryptoPaymentForm';

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

        defaultContributor.funding_distribution = "create"


        this.state = {
            scholarship: null,
            awards: [],
            scholarshipOwner: null,
            isLoadingScholarship: true,
            pageNumber: 0,
            contributor: defaultContributor,
            showRegistrationForm: true,
            fundingComplete: false,
            referredByUserProfile: null,
            showCustomContribution: false,
        }
    }

    componentDidMount() {
        const { match : { params : { slug }}} = this.props;
        const { contributor } = this.state;
        const updatedContributor = Object.assign({}, contributor);

        ScholarshipsAPI
            .getSlug(slug)
            .then(res => {
                const { scholarship, awards, owner_detail } = res.data;
                if (scholarship.is_crypto) { // change default contribution currency to ETH for crypto scholarships
                    updatedContributor.currency = ETH.code;
                    updatedContributor.funding_amount = 0.01; //0.1 ETH is a more realistic starting contribution ($25)
                }
                this.setState({ scholarship, awards, scholarshipOwner: owner_detail, contributor: updatedContributor }, () => {
                this.setFundingDistribution();
                });
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
        let value = event.target.value;
        let eventName = event.target.name;
        const keyCode = event.code || event.key;


        contributor = {
            ...contributor,
            [eventName]: value
        };
        if (eventName === "funding_amount") {
            // preserve decimal places when working with crypto values
            value = Currencies[contributor.currency].is_crypto ? Number.parseFloat(value) : Number.parseInt(value);
        }

        // If the user types a first name or last name then that implies they are not anonymous.
        // If no first or last name then they're anonymous.
        contributor.is_anonymous = !(contributor.first_name || contributor.last_name)

        this.setState({ contributor }, () => {
            if (!this.getContributorError(contributor) && keyCode === 'Enter'){
                this.changePage(pageNumber+1);
            }
        });
    };

    getContributorError = (contributor) => {

        const { scholarship } = this.state;
        let contributorError;

        if (scholarship?.is_crypto && !CryptoCurrencies.includes(contributor.currency)) {
            contributorError = `This is a crypto scholarship. You must select one of the following currencies: ${CryptoCurrencies.join(', ')}`
        }

        if (contributor.email && !isValidEmail(contributor.email)) {
            // Don't print a full invalid input statement because user might still be typing
            contributorError = true;
        }

        const currency = contributor.currency;
        if (!contributor.funding_amount) {
            contributorError = `Please enter a contribution amount.`
        }
        if (contributor.funding_amount < Currencies[currency].minimum_funding_amount_contribute_scholarship
            && contributor.funding_distribution !== "create") {
            contributorError = `Minimum contribution amount is ${Currencies[currency].minimum_funding_amount_contribute_scholarship}. ${currency}`;
        }
        if (contributor.funding_distribution === "create" &&
            contributor.funding_amount < Currencies[currency].minimum_funding_amount_contribute_new_award) {
            contributorError = `Minimum contribution amount for starting a new award is ${Currencies[currency].minimum_funding_amount_contribute_new_award}. ${currency}`;
        }

        return contributorError;
    }

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
        const { contribution } = fundingCompletionData;

        // set pageNumber to the last page of scholarshipContributionPages
        this.setState({contributor: contribution, pageNumber: scholarshipContributionPages.length - 1, fundingComplete: true});

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

    toggleShowCustomContribution = () => {
        const { showCustomContribution } = this.state;

        this.setState({showCustomContribution: !showCustomContribution});
    }

    setFundingDistribution = () => {
        const { contributor, awards } = this.state;

        const matchingAwards = awards.filter(award => award.currency === contributor.currency);
        let newDistribution = "create"
        if (matchingAwards.length > 0) {
            newDistribution = matchingAwards[0].id
        }
        const newContributor = { ...contributor, funding_distribution: newDistribution }
        this.setState({contributor: newContributor});
    }

    onCurrencyChange = (newCurrency) => {
        const { contributor } = this.state;

        const newContributor = { ...contributor, currency: newCurrency };
        this.setState({contributor: newContributor}, () => {
            this.setFundingDistribution();
        });
    }

    amountPageRender = () => {
        const { scholarship, awards, contributor, showCustomContribution } = this.state;
        const { funding_distribution, currency } = contributor

        const minContributionInfo = (
            <div>
                Minimum contribution: {Currencies[currency].minimum_funding_amount_contribute_scholarship} {currency}.
                <br />
                Minimum contribution for new award: {Currencies[currency].minimum_funding_amount_contribute_new_award} {currency}.
            </div>
        )

        const currency_options = CURRENCY_CODES.map(code => {return {'label': code, 'value': code}})

        const renderChangeCurrency = (
            <>
                Currency:{' '}
                <Select value={currency} options={currency_options} onChange={this.onCurrencyChange} />
            </>
        )

        return (
            <div className="col-12">
                <h1>
                    How much would you like to contribute to {scholarship.name}?
                </h1>

                <Input value={contributor.funding_amount}
                       prefix={currency}
                       name="funding_amount"
                       placeholder="Funding Amount"
                       className="col-12 mb-1"
                       type="number"
                       min="0"
                       step="1"
                       onChange={this.updateContributorInfo}/>

                <br />
                {Currencies[currency].is_crypto && <small className="float-left"><CurrencyDisplay amount={contributor.funding_amount} inputCurrency={currency} /></small>}
                <br />
                {renderChangeCurrency}
                <br />
                <br />
                <Button onClick={this.toggleShowCustomContribution}>Customize Contribution</Button>
                {showCustomContribution &&
                <>
                    <br /> <br />
                    <h3>How would you like the contribution amount to  be split?</h3>
                    <Radio.Group onChange={this.updateContributorInfo}
                        value={funding_distribution}
                        name={"funding_distribution"}>
                        <Space direction="vertical">
                            {awards.filter(award => award.currency === contributor.currency)
                                .map(award => {
                                let numFundingAmount = Number.parseFloat(award.funding_amount)

                                if (!contributor.funding_amount) {
                                    return <Radio value={award.id} key={award.id}>
                                        Increase the {numFundingAmount} {award.currency} award.
                                    </Radio>
                                }

                                let newAwardTotal = Number.parseFloat(award.funding_amount) + Number.parseFloat(contributor.funding_amount)
                                return <Radio value={award.id} key={award.id}>
                                    Increase the {numFundingAmount} {award.currency} award to {newAwardTotal} {contributor.currency}
                                </Radio>
                            })}
                            <Radio value={"create"}>
                                {contributor.funding_amount ? `Create a new award with value ${contributor.funding_amount} ${contributor.currency}.`
                                    : `Create a new award.`}
                            </Radio>
                        </Space>
                    </Radio.Group>

                    <br />
                    <br />
                    <Alert message={minContributionInfo}
                           type="info"
                    />
                </>
                }
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
                <h4>
                    Optional for crypto scholarships
                </h4>

                <Input value={contributor.email}
                       name="email"
                       type="email"
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

    paymentPageRender = (scholarshipPaymentForm) => {
        return (
            <div className="col-12">
                <h1>
                    Enter Payment Details
                </h1>
                {scholarshipPaymentForm}
            </div>
        )
    }

    completePageRender = (scholarshipPaymentForm) => {
        const { userProfile } = this.props;
        const { scholarship, contributor, showRegistrationForm } = this.state;

        return (
            <div className="col-12">
                <div>
                    <h1>Share your Contribution Image</h1>
                    {contributor.funding_confirmation_image_url &&
                    <>
                        <div className="col-12">
                            <img src={contributor.funding_confirmation_image_url}
                                 style={{width: "100%"}} alt={`Scholarship Contribution confirmation for ${contributor.first_name || 'you'}`} />
                            {/*
                                                After 3 seconds, hide the message that tells the user the image may take some time to load.
                                                The images are generated using htmlcsstoimage.com which can take about 3 seconds to load.
                                                So this means that even though contributor.funding_confirmation_image_url is truthy because the URL has loaded
                                                The HTTP get request for contributor.funding_confirmation_image_url hasn't rendered the image on the screen yet.
                                                This message lets the user know to stay on the page and not navigate away.
                                                Sample image: Go to src/models/scholarhip.js and find SCHOLARSHIP_CONTRIBUTION_EXAMPLE_IMAGE
                                             */}
                            <p id="hide-after-3-seconds">Your confirmation image may take a few seconds to display, please wait...</p>
                        </div>
                        <div className="col-12 text-center mb-3">
                            <a target="_blank" rel="noopener noreferrer" href={contributor.funding_confirmation_image_url}>
                                View Image (Right click or hold this link on mobile to save image)
                            </a>
                        </div>
                    </>
                    }
                    <div className="col-12 text-center mb-3">
                        <Link to={`/scholarship/${scholarship.slug}`}>
                            View Scholarship: {scholarship.name}
                        </Link>
                    </div>
                    {scholarshipPaymentForm}
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
                                  disableRedirect={true}
                                  className=""/>
                        }
                    </div>
                    }

                </div>
            </div>
        )
    }

    render () {
        const { isLoadingScholarship, scholarship, pageNumber, contributor, fundingComplete } = this.state;

        const contributorError = this.getContributorError(contributor)
        

        let scholarshipPaymentForm = null
        if (pageNumber >= 3) {
            // Only initialize this component on the necessary pages.
            scholarshipPaymentForm = <ScholarshipCryptoPaymentForm 
                                scholarship={scholarship}
                                awards={[{funding_amount: contributor.funding_amount}]}
                                onFundingComplete={data => this.onFundingComplete(data, scholarshipContributionPages)}
                                contributor={contributor} />
        }

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
                render: () => this.paymentPageRender(scholarshipPaymentForm),
            },
            {
                title: 'Complete',
                render: () => this.completePageRender(scholarshipPaymentForm),
            },
        ];

        const scholarshipSteps = (<Steps current={pageNumber} onChange={(newPage) => this.changePage(newPage)}>
            { scholarshipContributionPages.map(item => {

                let disableStep = contributorError || (!fundingComplete && (["Payment", "Complete"].includes(item.title)
                    // Disable if scholarship is not a crypto scholarship the email is invalid
                    // OR if it's a crypto scholarship and an email exists and the email is invalid
                    // In other words only disable a crypto scholarship if there's an email and it's invalid, but allow blank emails
                    && ((!scholarship?.is_crypto && !isValidEmail(contributor.email)) || (scholarship?.is_crypto && contributor.email && !isValidEmail(contributor.email)))
                    
                    ));

                if(item.title === "Complete") {
                    disableStep = !fundingComplete;
                }
                /*
                * Cast explicitly to boolean for example if disableStep has the value of contributorError,
                * and contributorError is a string, we need to cast it to boolean. Otherwise, ant design doesn't show
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
                    Back to {scholarship.name}
                </Link>
            </Button>}

            {pageNumber < scholarshipContributionPages.length - 1 &&
            <Button className="float-right col-md-6 mb-3"
                    type="primary"
                    onClick={() => this.changePage(pageNumber+1)}
                    disabled={contributorError
                    || (pageNumber === 1 && !contributor.first_name)
                    || (pageNumber === 2 && !contributor.email && !Currencies[contributor.currency].is_crypto)
                    || (pageNumber === 3 && !fundingComplete)}>
                Next
            </Button>}
        </div>
        )

        return (
            <div className="container mt-5 text-center">
                {scholarshipSteps}
                <div className="row my-3">

                    {scholarshipContributionPages[pageNumber].render()}

                    {contributorError &&
                        <div className="text-center col-12 mt-2">
                            <Alert message={contributorError} type="error" />
                        </div>
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
