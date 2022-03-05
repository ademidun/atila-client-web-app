import React from 'react';
import {Helmet} from "react-helmet";
import $ from 'jquery';
import FormDynamic from "../../components/Form/FormDynamic";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {connect} from "react-redux";
import {
    formatCurrency,
    nestedFieldUpdate,
    prettifyKeys,
    slugify,
    transformLocation
} from "../../services/utils";
import Loading from "../../components/Loading";
import {scholarshipUserProfileSharedFormConfigs, toastNotify} from "../../models/Utils";
import {
    DEFAULT_SCHOLARSHIP, DEFAULT_SCHOLARSHIP_CONTRIBUTOR, ScholarshipDisableEditMessage
} from "../../models/Scholarship";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import {Steps, InputNumber, Button, Alert, Select, Spin} from "antd";
import ScholarshipQuestionBuilder, {ScholarshipUserProfileQuestionBuilder} from "./ScholarshipQuestionBuilder";
import ScholarshipPaymentForm from "../Payment/ScholarshipPayment/ScholarshipPaymentForm";
import Environment from "../../services/Environment";
import InviteScholarshipCollaborator from "../../components/InviteScholarshipCollaborator";
import {CAD, CryptoCurrencies, CURRENCY_CODES} from "../../models/ConstantsPayments";
import { DEFAULT_AWARD } from '../../models/Award';
import CurrencyDisplay from '@atila/web-components-library.ui.currency-display';
import { additionalQuestions, scholarshipFormConfigsPage1 } from './ScholarshipAddEditFormConfig';
import ImportContent from '../../components/ImportContent';
import { ALL_DEMOGRAPHICS } from '../../models/ConstantsForm';
import { ScholarshipUtils } from '../../services/utils/ScholarshipUtils';
const { Step } = Steps;


let scholarshipFormConfigsPage2 = scholarshipUserProfileSharedFormConfigs
    .filter(question => !['eligible_schools', 'eligible_programs'].includes(question.keyName));

scholarshipFormConfigsPage2 = [...additionalQuestions, ...scholarshipFormConfigsPage2];

let autoSaveTimeoutId;
class ScholarshipAddEdit extends React.Component{

    constructor(props) {
        super(props);

        const { userProfile } = props;

        let contributor = Object.assign({}, DEFAULT_SCHOLARSHIP_CONTRIBUTOR);

        if (userProfile) {
            Object.keys(contributor).forEach(contributorKey => {

                if (userProfile.hasOwnProperty(contributorKey)) {
                    contributor[contributorKey] = userProfile[contributorKey]
                }

            });
        }
        contributor.funding_distribution = null;

        const scholarship = Object.assign({}, DEFAULT_SCHOLARSHIP);
        const awards = [Object.assign({}, DEFAULT_AWARD)];

        // The funding_amount should be the sum of created awards in the frontend until the award has been saved after which it should use the source from the backend as the source of truth.
        // returning an object contain a funding_amount property with the sum of the funding_amount properties of the parameters:
        // https://stackoverflow.com/a/5732087/5405197
        scholarship.funding_amount = awards.reduce((prevAward, currentAward) => 
        ({funding_amount: prevAward.funding_amount + currentAward.funding_amount})).funding_amount

        this.state = {
            scholarship: Object.assign({}, DEFAULT_SCHOLARSHIP),
            isAddScholarshipMode: false,
            scholarshipPostError: null,
            isLoadingScholarship: false,
            isUpdatingScholarship: false,
            errorLoadingScholarship: false,
            pageNumber: 0,
            locationData: [],
            awards: [Object.assign({}, DEFAULT_AWARD)],
            /**
             * When CkEditor loads for the first time, it calls onChange inside the <CkEditor> component
             * and fires onChange inside ScholarshipAddEdit.updateForm
             * It's important we track the first time onChange is called for criteria_info and don't
             * run auto-save on the initial load.
             */
            criteriaInfoInitialLoad: true,
            contributor,
        };
    }

    changePage = (pageNumber) => {
        const { scholarship } = this.state;
        this.setState({pageNumber}, () => {
            /**
             * Call this.disableScholarshipInputs() on each page change because we are using jquery to disable
             * certain inputs and those inputs may not yet be rendered until a new page is shown.
             */
            if (!scholarship.is_editable) {
                this.disableScholarshipInputs();
            }
        })
    };

    componentDidMount() {

        const { userProfile } = this.props;
        const { contributor } = this.state;

        const { match : { path }} = this.props;

        if ( path==='/scholarship/add' ) {
            this.setState({isAddScholarshipMode: true});
            const scholarship = this.state.scholarship;
            contributor.funding_amount = scholarship.funding_amount;

            if(userProfile) {
                scholarship.owner = userProfile.user;
            }
            else {
                toastNotify(`⚠️ Warning, you must be logged in to add a scholarship`);
            }
            this.setState({ scholarship, contributor });
        } else {
            this.loadContent();
        }
    }

    loadContent = () => {

        this.setState({ isLoadingScholarship: true });
        const { match : { params : { slug }} } = this.props;
        ScholarshipsAPI.getSlug(slug)
            .then(res => {
                const scholarship = ScholarshipsAPI.cleanScholarship(res.data.scholarship);
                const awards = res.data.awards;
                if (!scholarship.is_editable) {
                    this.disableScholarshipInputs();
                }
                let contributor = {...this.state.contributor}
                contributor.currency = awards[0]?.currency || CAD.code
                this.setState({ scholarship, awards, contributor }, () => {
                    this.setState({
                        locationData: ScholarshipUtils.initializeLocations(this.state.scholarship, [])
                    });
                });
            })
            .catch(err => {
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
     * If the scholarship is a direct application and has been published, scholarship.is_editable should be false.
     * Therefore deadline, eligibility and specific questions should be disabled.
     */
    disableScholarshipInputs = () => {
        /**
         * Disable inputs after a brief timeout to ensure that elements have loaded before jquery adds the disabled prop.
         */

        const { userProfile } = this.props;

        // Don't disable inputs if we are in non prod and user is atila admin
        if (userProfile?.is_atila_admin && Environment.name !== 'prod') {
            return;
        }

        setTimeout(() => {

            $("[name='is_atila_direct_application']").prop("disabled", true);
            $("[name='deadline']").prop("disabled", true);
            $("[name='funding_amount']").prop("disabled", true);
            $(".scholarship-eligibility-questions :input").prop("disabled", true);
            $(".scholarship-specific-questions :input").prop("disabled", true);
            // This last ones is just to make sure that the remaining elements (i.e. remove scholarhsip button
            // and remove locations) are also disabled.
            $(".scholarship-specific-questions").css("pointer-events","none");
            $(".scholarship-eligibility-questions").css("pointer-events","none");

        }, 100);
    };

    updateForm = (event) => {
        let value = event.target.value;
        let eventName = event.target.name;

        if (event.target.type==='checkbox'){
            value = event.target.checked
        }
        if (event.stopPropagation) {
            // Radio button needed to be clicked twice for change to be reflected in the DOM
            // https://github.com/facebook/react/issues/3446#issuecomment-82751540
            // https://stackoverflow.com/a/48425083/5405197
            event.stopPropagation(); 
        }


        if (eventName==='location') {
            const { locationData } = this.state;
            const newLocation = transformLocation(event.target.value);

            locationData.push(newLocation);
            this.setState({locationData});

            this.autoSaveAfterDelay()
            return;

        }

        if (eventName === "funding_amount") {
            value = Number.parseInt(value)
        }

        let { scholarship, criteriaInfoInitialLoad } = this.state;

        if (eventName.includes('.')) {
            scholarship = nestedFieldUpdate(scholarship, eventName, value);
        }
        else {
            const scholarship = this.state.scholarship;

            if ( Array.isArray(scholarship[eventName]) && !Array.isArray(value) ) {
                scholarship[eventName].push(value);
            } else {
                scholarship[eventName] = value;
            }

            if(eventName==='name') {
                scholarship.slug = slugify(event.target.value);
            }
        }

        /**
         * See declaration of criteriaInfoInitialLoad in ScholarshipAddEdit.constructor()
         * to see why we need the following code snippet.
         */
        if(eventName === "criteria_info" && criteriaInfoInitialLoad) {
            this.setState({criteriaInfoInitialLoad: false})
        } else {
            this.updateScholarship(scholarship);
        }

    };

    autoSaveAfterDelay = () => {
        if (autoSaveTimeoutId) {
            clearTimeout(autoSaveTimeoutId);
        }
        autoSaveTimeoutId = setTimeout(() => {
            // Runs 1 second (1000 ms) after the last change
            this.autoSaveScholarship();
        }, 1000);
    }

    updateScholarship = (scholarship, isAutoSaving = true) => {
        this.setState({scholarship}, () => {
            if (isAutoSaving) {
                this.autoSaveAfterDelay()
            }
        })
    };

    onFundingComplete = (fundingData) => {
        const { scholarship } = fundingData;
        this.updateScholarship(scholarship);
    };

    autoSaveScholarship = () => {
        const { isAddScholarshipMode } = this.state;

        if (!isAddScholarshipMode) {
            this.submitForm({});
        }
    };

    submitForm = (event) => {
        if(event && event.preventDefault) {
            event.preventDefault();
        }
        const scholarship = ScholarshipsAPI.cleanScholarship(this.state.scholarship);
        this.setState({scholarship});


        const { isAddScholarshipMode, locationData, awards, pageNumber } = this.state;
        const { userProfile } = this.props;
        const pageTitle = this.scholarshipEditPages()[pageNumber].title;

        const isUpdateScholarshipState = isAddScholarshipMode || pageTitle === "Awards";

        if (isUpdateScholarshipState) {
            this.setState({isUpdatingScholarship: "Updating scholarship"})
        }

        if(!userProfile) {
            toastNotify(`⚠️ Warning, you must be logged in to add a scholarship`);
            return;
        }
        let postResponsePromise;

        if(isAddScholarshipMode) {
            postResponsePromise = ScholarshipsAPI.create(scholarship,locationData, awards)
        } else {
            // only update the awards object if user is on the awards page
            postResponsePromise = ScholarshipsAPI.put(scholarship.id, scholarship, locationData, pageTitle === "Awards" ? awards : null);
        }
        postResponsePromise
            .then(res => {
                const savedScholarship = ScholarshipsAPI.cleanScholarship(res.data.scholarship);
                if (!savedScholarship.is_editable) {
                    this.disableScholarshipInputs();
                }

                if (isAddScholarshipMode) {
                    this.setState({ scholarship: savedScholarship });
                    const successMessage = (<p>
                        <span role="img" aria-label="happy face emoji">🙂</span>
                        Successfully saved {' '}
                        <Link to={`/scholarship/${savedScholarship.slug}`}>
                            {savedScholarship.name}
                        </Link>
                    </p>);
                    toastNotify(successMessage, 'info', {position: 'bottom-right'});
                }
                const awards = res.data.awards;
                /**
                 * We only want to update the funding_amount with the auto-updated values
                 *  and the user knows the data was autosaved.
                 */
                 const updatedScholarship = {
                    ...this.state.scholarship,
                    funding_amount: res.data.scholarship.funding_amount,
                };
                this.setState({isAddScholarshipMode: false, awards, scholarshipPostError: null, scholarship: updatedScholarship});
            })
            .catch(err=> {
                console.log({err});
                let scholarshipPostError = err.response && err.response.data;
                scholarshipPostError = JSON.stringify(scholarshipPostError, null, 4);
                this.setState({scholarshipPostError});
                toastNotify(`🙁${scholarshipPostError}`, 'error');

            })
            .finally(()=>{
                if (isUpdateScholarshipState) {
                    this.setState({isUpdatingScholarship: false})
                }        
            });

    };

    removeLocationData = (index) => {

        const {locationData} = this.state;

        locationData.splice(index, 1);
        this.setState({locationData});
    };

    handleImportScholarship = importedScholarship => {

        const { awards: importedAwards } = importedScholarship;
        const newScholarship = Object.assign({}, this.state.scholarship);
        let fieldsToImport = [...scholarshipFormConfigsPage1.map(field=> field.keyName), ...additionalQuestions.map(field=> field.keyName)];

        const locationFields = ['city', 'province', 'country'];
        const scholarshipApplicationQuestions = ['user_profile_questions', 'specific_questions', 'country'];
        fieldsToImport = [...fieldsToImport, ...scholarshipApplicationQuestions, ...locationFields, ...Object.keys(ALL_DEMOGRAPHICS)];

        const fieldsToExcludeFromImport = ['metadata.not_open_yet', 'open_date', 'location'];

        fieldsToImport.filter(key => !fieldsToExcludeFromImport.includes(key)).forEach(key => {
            newScholarship[key] = importedScholarship[key]
        })

        let newAwards = [...this.state.awards];
        if(importedAwards?.length > 0) {
            newAwards = importedScholarship.awards.map(award => ({funding_amount: award.funding_amount, currency: award.curency}))
        }

        const locationData = ScholarshipUtils.initializeLocations(newScholarship, []);

        // delete the city, province, country fields sicne we'll be using locationData as the source of truth for location information
        locationFields.forEach(locationField => {
            delete newScholarship[locationField];
        })
        this.setState({scholarship: newScholarship, awards: newAwards, locationData});

    }

    basicInfoPage = () => {
        const { scholarship, scholarshipPostError, isAddScholarshipMode } = this.state;
        const { userProfile } = this.props;

        return (
            <div className="my-3">
                {isAddScholarshipMode && 
                <div className="px-3">
                    <ImportContent contentType="scholarships" onSelectContent={this.handleImportScholarship}/>
                </div>
                }
                <FormDynamic model={scholarship}
                             loggedInUserProfile={userProfile}
                             inputConfigs={scholarshipFormConfigsPage1}
                             onUpdateForm={this.updateForm}
                             formError={scholarshipPostError}
                             onSubmit={this.submitForm}/>
            </div>
        )
    }

    eligibilityPage = () => {
        const { scholarship, locationData, scholarshipPostError } = this.state;

        return (
            <div className="my-3 scholarship-eligibility-questions">
                <h6>Leave blank for each criteria that is open to any</h6>
                {locationData && locationData.length > 0 &&
                <div>
                    <h3 >Locations</h3>
                    <table className="table">
                        <thead>
                        <tr>
                            {['city','province','country'].map(location =>
                                <th key={location}>{prettifyKeys(location)}</th>)
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {locationData.map((locationItem, index) => <tr key={index}>
                                {['city','province','country'].map(location =>
                                    <td key={location}>{locationItem[location]}</td>
                                )}
                                <td>
                                    <button className="btn btn-outline-primary"
                                            onClick={()=> this.removeLocationData(index)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                }
                <FormDynamic model={scholarship}
                             inputConfigs={scholarshipFormConfigsPage2}
                             onUpdateForm={this.updateForm}
                             formError={scholarshipPostError}
                             onSubmit={this.submitForm}
                />

            </div>)
    }

    updateFundingAmount = () => {
        const { awards, contributor } = this.state;
        let scholarship = {...this.state.scholarship}

        let newFundingAmount = 0
        awards.forEach(award => newFundingAmount += Number.parseFloat(award.funding_amount))
        scholarship.funding_amount = newFundingAmount
        contributor.funding_amount = scholarship.funding_amount;

        this.setState({ scholarship, contributor })
    }

    changeAward = (newValue, index) => {
        let newAwards = this.state.awards.slice()
        newAwards[index].funding_amount = newValue
        this.setState({awards: newAwards}, ()=> {
            this.updateFundingAmount()
            this.autoSaveAfterDelay()
        })
    }

    removeAward = (index) => {
        let newAwards = this.state.awards.slice()
        newAwards.splice(index, 1)
        this.setState({awards: newAwards}, ()=> {
            this.updateFundingAmount()
            this.autoSaveAfterDelay()
        })
    }

    addAward = () => {
        const { contributor } = this.state;
        let newAward = Object.assign({}, DEFAULT_AWARD)
        newAward.currency = contributor.currency

        let newAwards = this.state.awards.slice()
        newAwards.push(newAward)
        this.setState({awards: newAwards}, ()=> {
            this.updateFundingAmount()
            this.autoSaveAfterDelay()
        })
    }

    onCurrencyChange = (newCurrency) => {
        let newAwards = this.state.awards.slice()
        let contributor = {...this.state.contributor}

        contributor.currency = newCurrency
        newAwards.forEach(award => award.currency = newCurrency)

        this.setState({awards: newAwards, contributor}, () =>{
            this.autoSaveAfterDelay()
        })
    }



    scholarshipEditPages = () => [
        {
            title: 'Basic Info',
            render: this.basicInfoPage,
        },
        {
            title: 'Awards',
            render: this.awardsPage,
        },
        {
            title: 'Eligibility',
            render: this.eligibilityPage,
        },
        {
            title: 'Specific Questions',
            render: this.specificQuestionsPage,
        },
        {
            title: 'Funding',
            render: this.fundingPage,
        },
    ]


    awardsPage = () => {
        // This should be moved into a separate component like AwardAddEdit.
        const { scholarship, awards, isAddScholarshipMode, contributor, isUpdatingScholarship } = this.state;
        const { currency } = contributor;
        
        // TODO find a way to disable all inputs on page without having to manually add disabled={disableEditingAwards} to each input
        const disableEditingAwards = scholarship.is_funded;

        const renderAwards = awards.map((award, index) => (
            <div key={index}>
                Award {index + 1}:{' '}
                <InputNumber size={"large"}
                             value={award.funding_amount}
                             onChange={value => this.changeAward(value, index)}
                             style={{width: "30%"}}
                             // formatter={value => `${currency} ${value}`}
                             keyboard={false}
                             stringMode={true}
                             disabled={disableEditingAwards}
                />

                            <Button danger
                            onClick={()=>this.removeAward(index)}
                            disabled={disableEditingAwards}
                            style={{float: "right"}}>
                                Remove
                            </Button>
                <br />
                <br />
            </div>
        ))

        const currency_options = CURRENCY_CODES.map(code => {return {'label': code, 'value': code}});

        // The funding_amount should be the sum of created awards in the frontend until the award has been saved after which it should use the funding_amount from the backend 
        // as the source of truth returning an object with a funding_amount property with the sum of the funding_amount properties of the parameters:
        // https://stackoverflow.com/a/5732087/5405197
        const totalAwardsAmount = isAddScholarshipMode ? awards.reduce((prevAward, currentAward) => 
        ({funding_amount: prevAward.funding_amount + currentAward.funding_amount})).funding_amount : scholarship.funding_amount;

        const renderChangeCurrency = (
            <>
                Currency:{' '}
                <Select value={currency} options={currency_options} onChange={this.onCurrencyChange} disabled={disableEditingAwards} />
            </>
        )

        return (
            <div className={"my-3"}>
                {/* After the scholarship has been created, if it's a crytpo scholarship it may have multiple currencies so we should defer to the scholarship.currency field
                 because it will usually be in USD which represents the aggregated value of all the awards after it has been converted */}
                 <Spin tip={isUpdatingScholarship} spinning={isUpdatingScholarship}>
                        <h5>
                            Total Funding Amount: {CryptoCurrencies.includes(currency) ? 
                            <CurrencyDisplay amount={totalAwardsAmount} inputCurrency={isAddScholarshipMode ? currency : scholarship.currency} outputCurrency={CAD.code} /> :  
                            `${formatCurrency(Number.parseFloat(totalAwardsAmount))} ${currency}`}
                        </h5>
                 </Spin>
                 {disableEditingAwards && 
                    <Alert message="Once the scholarship has been funded, awards cannot be changed. Visit the contribution page to add or increase awards." />
                 }
                
                <br />
                {renderChangeCurrency}
                <br />
                <br />
                {renderAwards}
                <Button type="primary" onClick={this.addAward} disabled={disableEditingAwards}>Add Award</Button>
                <br />
                <br />
                <InviteScholarshipCollaborator
                    isButtonDisabled={isAddScholarshipMode}
                    scholarship={scholarship}
                    source={"edit"}
                />
                {isAddScholarshipMode &&
                <>
                    <br />
                    <Alert message={"Save scholarship to invite other collaborators."} type={"info"} />
                </>}
            </div>
        )
    }

    specificQuestionsPage = () => {
        const { scholarship } = this.state;

        return (
            <div className="mt-3 mb-5 scholarship-specific-questions">
                <h3>User Profile Questions</h3>
                <ScholarshipUserProfileQuestionBuilder scholarship={scholarship}
                                                       onUpdate={this.updateForm} />
                <hr/>
                <h3>Scholarship Specific Questions</h3>
                <ScholarshipQuestionBuilder scholarship={scholarship}
                                            onUpdate={this.updateForm} />
            </div>
        )
    }

    fundingPage = () => {
        const { scholarship, contributor, awards } = this.state;


        if (scholarship.is_funded) {
            return <h1>
                This scholarship has been funded.<br/>
                Visit <Link to={`/scholarship/${scholarship.slug}/contribute`}>scholarship contribution page</Link> to add more awards
            </h1>
        }

        // The funding_amount should be the sum of created awards in the frontend until the award has been saved after which it should use the funding_amount from the backend 
        // as the source of truth returning an object with a funding_amount property with the sum of the funding_amount properties of the parameters:
        // https://stackoverflow.com/a/5732087/5405197
        let totalAwardsAmount = awards.reduce((prevAward, currentAward) => 
        ({funding_amount: Number.parseFloat(prevAward.funding_amount) + Number.parseFloat(currentAward.funding_amount), currency: currentAward.currency})).funding_amount;

        totalAwardsAmount = Number.parseFloat(totalAwardsAmount);
        return (
            <div className="my-3">
                <ScholarshipPaymentForm scholarship={scholarship}
                             onFundingComplete={this.onFundingComplete}
                             awards={awards}
                             contributor={contributor}
                             contributorFundingAmount={totalAwardsAmount} />
            </div>
        )
    }

    render() {
        const { scholarship, isAddScholarshipMode, isLoadingScholarship,
            pageNumber, errorLoadingScholarship } = this.state;
        const { userProfile } = this.props;

        let scholarshipEditPages = this.scholarshipEditPages();

        if (errorLoadingScholarship) {
            return errorLoadingScholarship;
        }

        if (isLoadingScholarship) {
            return <Loading  title="Loading Scholarship"/>
        }

        const { is_atila_direct_application } = scholarship;

        let updatedAtDate;

        if (scholarship) {
            updatedAtDate = new Date(scholarship.updated_at);
            updatedAtDate =  (<p className="text-muted center-block">
                Last Auto-Saved: {updatedAtDate.toDateString()}{' '}
                {updatedAtDate.toLocaleTimeString()}
            </p>)
        }
        if (!is_atila_direct_application) {
            scholarshipEditPages = [scholarshipEditPages[0], scholarshipEditPages[2]]
        }

        const scholarshipSteps = (
            <Steps current={pageNumber} onChange={current => this.changePage(current)}>
                { scholarshipEditPages.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>);

        const title = isAddScholarshipMode ? 'Add Scholarship' : 'Edit Scholarship';
        const helmetTitle = `${title}${scholarship? ": " + scholarship.name : ""}`;

        const navigationButtons = (
            <div className="my-2" style={{clear: 'both'}}>
                {pageNumber < scholarshipEditPages.length - 1 &&
                <button className="btn btn-outline-primary float-right col-md-6"
                        onClick={() => this.changePage(pageNumber+1)}>Next</button>}
                {pageNumber > 0 &&
                <button className="btn btn-outline-primary float-left col-md-6"
                        onClick={() => this.changePage(pageNumber-1)}>Prev</button>}
            </div>)

        return (
            <div className="ScholarshipAddEdit">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{helmetTitle} - Atila</title>
                </Helmet>
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        <h1>{title}: {scholarship.name}</h1>
                        {scholarship.slug && !isAddScholarshipMode &&
                        <Link to={`/scholarship/${scholarship.slug}`} className="text-center">
                            View Scholarship
                        </Link>
                        }
                        {!isAddScholarshipMode && updatedAtDate}
                        {!scholarship.is_editable && <ScholarshipDisableEditMessage />}
                        <hr/>
                        {scholarshipSteps}
                        {!userProfile &&
                        <h4>
                            <span role="img" aria-label="warning emoji">
                                ⚠️
                            </span> Warning, you must be logged in to add a scholarship
                        </h4>
                        }

                        {scholarshipEditPages[pageNumber].render()}

                        {navigationButtons}
                        <hr/>

                        {scholarshipSteps}

                        <hr/>

                        {!isAddScholarshipMode && updatedAtDate }
                        {isAddScholarshipMode &&
                            <Button onClick={this.submitForm}
                                    type={"primary"}
                                    size={"large"}
                            >
                                Save
                            </Button>
                        }
                        {!scholarship.published && scholarship.is_atila_direct_application &&
                        <p className="text-muted center-block">
                            Funding your scholarship will make it public and go live!
                        </p>
                        }
                        {scholarship.published &&
                        <p className="text-muted center-block">
                            Published
                        </p>
                        }
                    </div>
                </div>
            </div>
        );

    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipAddEdit);