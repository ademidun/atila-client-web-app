import React from 'react';
import {Helmet} from "react-helmet";
import $ from 'jquery';
import FormDynamic from "../../components/Form/FormDynamic";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {connect} from "react-redux";
import {
    displayLocalTimeZone,
    nestedFieldUpdate,
    prettifyKeys,
    slugify,
    transformLocation
} from "../../services/utils";
import Loading from "../../components/Loading";
import {MAJORS_LIST, SCHOOLS_LIST} from "../../models/ConstantsForm";
import {scholarshipUserProfileSharedFormConfigs, toastNotify} from "../../models/Utils";
import {
    AtilaDirectApplicationsPopover,
    DEFAULT_SCHOLARSHIP, DEFAULT_SCHOLARSHIP_CONTRIBUTOR, ScholarshipDisableEditMessage
} from "../../models/Scholarship";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import {Steps, Tag, InputNumber, Button, Alert, Select} from "antd";
import ScholarshipQuestionBuilder, {ScholarshipUserProfileQuestionBuilder} from "./ScholarshipQuestionBuilder";
import PaymentSend from "../Payment/PaymentSend/PaymentSend";
import Environment from "../../services/Environment";
import InviteScholarshipCollaborator from "../../components/InviteScholarshipCollaborator";
import {CAD, CURRENCY_CODES} from "../../models/ConstantsPayments";
import { DEFAULT_AWARD } from '../../models/Award.class';
const { Step } = Steps;


let scholarshipFormConfigsPage1 = [
    {
        keyName: 'name',
        placeholder: 'Scholarship Name',
        type: 'text',
        html: (model) => (
            <p className="text-muted">{model.slug && `Slug: atila.ca/scholarship/${model.slug}`}</p>
        )
    },
    {
        keyName: 'description',
        type: 'textarea',
        placeholder: 'Scholarship Description',
        html: () => (<label htmlFor="description">
            Description (Eligibility): Who is eligible for this scholarship?
        </label>),
    },
    {
        keyName: 'is_atila_direct_application',
        placeholder:(
            <AtilaDirectApplicationsPopover children={<div>
                Allow applicants to directly apply for scholarship through Atila?{' '}<small>Hover to learn more</small>
                {' '}<Tag color="green">new</Tag>
                </div>
                } />
            ),
        type: 'checkbox',
        className: 'font-weight-bold',
    },
    // Temporarily hide blind applications feature to prevent confusing the application process.
    // We currently launched a bunch of new features and this might confuse new potential sponsors.
    // We can make the blind applications feature available on a case-by-case basis if a scholarship sponsor wants it.
/*     {
        keyName: 'is_blind_applications',
        placeholder:"Hide names of applicants until a winner is selected",
        type: 'checkbox',
        className: 'font-weight-bold',
        isHidden: (scholarship) => (!scholarship.is_atila_direct_application),
    }, */
    {
        keyName: 'criteria_info',
        type: 'html_editor',
        placeholder: 'Additional Information',
        html: () => (<label htmlFor="description">
            Everything else you want people to know about the scholarship, put it here. <br/>
            For example:
            What inspired you to start this scholarship? What types of students would you like to fund.
            What would you like to see from the applicants? etc.
            <span role="img" aria-label="pointing down emoji">
            👇🏿
            </span>
        </label>),
    },
    {
        keyName: 'learn_more_url',
        placeholder: 'Optional: A URL to a place where others can learn more about you or your organization',
        type: 'url',
        isHidden: (scholarship) => (!scholarship.is_atila_direct_application),
    },
    {
        keyName: 'learn_more_title',
        placeholder: 'Title for the url: e.g. Learn more about Skateboards for Hope',
        type: 'text',
        isHidden: (scholarship) => (!scholarship.is_atila_direct_application),
    },
    {
        keyName: 'scholarship_url',
        placeholder: 'Scholarship Url',
        type: 'url',
        isHidden: (scholarship) => (scholarship.is_atila_direct_application),
    },
    {
        keyName: 'form_url',
        placeholder: 'Application Form URL',
        type: 'url',
        isHidden: (scholarship) => (scholarship.is_atila_direct_application),
    },
    {
        keyName: 'img_url',
        placeholder: 'Scholarship Image URL',
        type: 'image',
    },
    {
        keyName: 'deadline',
        type: 'datepicker',
        html: (scholarship) =>(<label htmlFor="deadline">
            Deadline <span role="img" aria-label="clock emoji">🕐</span>
            {scholarship.deadline && <small> We recommend picking a deadline within the next two months.
            Using local timezone ({displayLocalTimeZone()}).
            </small>}
        </label>),
    },

     {
         keyName: 'metadata.not_open_yet',
         placeholder: 'Scholarship not open yet?',
         type: 'checkbox',
     },
     {
         keyName: 'open_date',
         type: 'date',
         isHidden: (scholarship) => (scholarship.metadata && !scholarship.metadata.not_open_yet),
         html: () =>(<label htmlFor="open_date">
             When does the scholarship open? <span role="img" aria-label="calendar emoji">🗓</span>
         </label>),
     },
     {
         keyName: 'is_not_available',
         placeholder: 'Is not available?',
         type: 'checkbox',
     },
     {
         keyName: 'reddit_url',
         placeholder: 'Reddit Help Thread URL',
         type: 'url',
         isHidden: (scholarship, userProfile) => (userProfile && !userProfile.is_atila_admin),
     },
];

let additionalQuestions = [
    {
        keyName: 'location',
        placeholder: 'Enter city, province, country 🌏',
        html: () =>(<label htmlFor="location">
            Is the scholarship limited to students in certain locations?
            <span role="img" aria-label="globe emoji">🌏</span>
        </label>),
        type: 'location',
    },
    {
        keyName: 'eligible_schools',
        placeholder: 'Eligible Schools (leave blank for any) 🏫',
        type: 'autocomplete',
        suggestions: SCHOOLS_LIST
    },
    {
        keyName: 'eligible_programs',
        placeholder: 'Eligible Programs (leave blank for any) 📚',
        type: 'autocomplete',
        suggestions: MAJORS_LIST
    },
    {
        keyName: 'female_only',
        placeholder: 'Female Only? 🙍🏿',
        type: 'checkbox',
    },
    {
        keyName: 'international_students_eligible',
        placeholder: 'International Students Eligible? 🌏',
        type: 'checkbox',
    },
    {
        keyName: 'email_contact',
        placeholder: 'Email address for sending questions and submissions',
        type: 'email',
    },
];
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

        this.state = {
            scholarship: Object.assign({}, DEFAULT_SCHOLARSHIP),
            isAddScholarshipMode: false,
            scholarshipPostError: null,
            isLoadingScholarship: true,
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
            this.setState({isLoadingScholarship: false});
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
                    this.updateFundingAmount()
                    this.initializeLocations();
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

    // https://github.com/ademidun/atila-angular/blob/dfe3cbdd5d9a5870e095c089d85394ba934718b5/src/app/scholarship/add-scholarship/add-scholarship.component.ts#L681
    initializeLocations = () => {
        // See createLocations() int edit-scholarship or add-scholarship.component.ts
        const { scholarship, locationData } = this.state;

        for (let index = 0; index <scholarship.country.length; index++) {
            let element =scholarship.country[index];
            locationData.push({
                'country': element.name
            });
        }

        for (let index = 0; index <scholarship.province.length; index++) {
            let element =scholarship.province[index];
            locationData.push({
                'country': element.country,
                'province':element.name
            });
        }

        for (let index = 0; index <scholarship.city.length; index++) {
            let element =scholarship.city[index];
            locationData.push({
                'country': element.country,
                'province':element.province,
                'city': element.name,
            });
        }

        this.setState({
            locationData
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

        const { isAddScholarshipMode, locationData, awards } = this.state;
        const { userProfile } = this.props;

        if(!userProfile) {
            toastNotify(`⚠️ Warning, you must be logged in to add a scholarship`);
            return;
        }
        let postResponsePromise;

        if(isAddScholarshipMode) {
            postResponsePromise = ScholarshipsAPI.create(scholarship,locationData, awards)
        } else {
            postResponsePromise = ScholarshipsAPI.put(scholarship.id, scholarship, locationData, awards);
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
                this.setState({isAddScholarshipMode: false, awards});
                this.setState({scholarshipPostError: null});
            })
            .catch(err=> {
                console.log({err});
                let scholarshipPostError = err.response && err.response.data;
                scholarshipPostError = JSON.stringify(scholarshipPostError, null, 4);
                this.setState({scholarshipPostError});
                toastNotify(`🙁${scholarshipPostError}`, 'error');

            })
            .finally(()=>{});

    };

    removeLocationData = (index) => {

        const {locationData} = this.state;

        locationData.splice(index, 1);
        this.setState({locationData});
    };

    basicInfoPage = () => {
        const { scholarship, scholarshipPostError } = this.state;
        const { userProfile } = this.props;

        return (
            <div className="my-3">
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

    awardsPage = () => {
        // This should be moved into a separate component like AwardAddEdit.
        const { scholarship, awards, isAddScholarshipMode, contributor } = this.state;
        const { currency } = contributor

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
                />

                            <Button danger
                            onClick={()=>this.removeAward(index)}
                            style={{float: "right"}}>
                                Remove
                            </Button>
                <br />
                <br />
            </div>
        ))

        const currency_options = CURRENCY_CODES.map(code => {return {'label': code, 'value': code}})

        const renderChangeCurrency = (
            <>
                Currency:{' '}
                <Select value={currency} options={currency_options} onChange={this.onCurrencyChange} />
            </>
        )

        return (
            <div className={"my-3"}>
                <h5>Total Funding Amount: {scholarship.funding_amount} {currency}</h5>
                <br />
                {renderChangeCurrency}
                <br />
                <br />
                {renderAwards}
                <Button type="primary" onClick={this.addAward} >Add Award</Button>
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
        const { scholarship, contributor } = this.state;

        return (
            <div className="my-3">
                <PaymentSend scholarship={scholarship}
                             onFundingComplete={this.onFundingComplete}
                             contributor={contributor}
                             contributorFundingAmount={Number.parseFloat(scholarship.funding_amount)} />
            </div>
        )
    }

    render() {
        const { scholarship, isAddScholarshipMode, isLoadingScholarship,
            pageNumber, errorLoadingScholarship } = this.state;
        const { userProfile } = this.props;

        if (errorLoadingScholarship) {
            return errorLoadingScholarship;
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


        let scholarshipEditPages = [
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
        ];

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
                    {isLoadingScholarship && <Loading  title="Loading Scholarships..."/>}
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