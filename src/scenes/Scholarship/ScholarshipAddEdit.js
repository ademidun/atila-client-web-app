import React from 'react';
import {Helmet} from "react-helmet";
import $ from 'jquery';
import FormDynamic from "../../components/Form/FormDynamic";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {connect} from "react-redux";
import {nestedFieldUpdate, prettifyKeys, slugify, transformLocation} from "../../services/utils";
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
import {Steps, Tag} from "antd";
import ScholarshipQuestionBuilder, {ScholarshipUserProfileQuestionBuilder} from "./ScholarshipQuestionBuilder";
import PaymentSend from "../Payment/PaymentSend/PaymentSend";
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
        keyName: 'funding_amount',
        placeholder: 'Funding Amount 💵',
        type: 'number',
    },

    // {
    //     keyName: 'number_available_scholarships',
    //     placeholder: 'Number of Available Scholarships',
    //     type: 'number',
    // },

    {
        keyName: 'deadline',
        type: 'datetime-local',
        html: (scholarship) =>(<label htmlFor="deadline">
            Deadline <span role="img" aria-label="clock emoji">🕐</span>
            {scholarship.deadline && <small>We recommend picking a deadline within the next two months</small>}
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

        let contributor = DEFAULT_SCHOLARSHIP_CONTRIBUTOR;

        if (userProfile) {
            Object.keys(contributor).forEach(contributorKey => {

                if (userProfile[contributorKey]) {
                    contributor[contributorKey] = userProfile[contributorKey]
                }

            });
        }

        this.state = {
            scholarship: Object.assign({}, DEFAULT_SCHOLARSHIP),
            isAddScholarshipMode: false,
            scholarshipPostError: null,
            isLoadingScholarship: true,
            errorLoadingScholarship: false,
            pageNumber: 1,
            locationData: [],
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

        const { match : { path }} = this.props;

        if ( path==='/scholarship/add' ) {
            this.setState({isAddScholarshipMode: true});
            this.setState({isLoadingScholarship: false});
            const scholarship = this.state.scholarship;

            if(userProfile) {
                scholarship.owner = userProfile.user;
            }
            else {
                toastNotify(`⚠️ Warning, you must be logged in to add a scholarship`);
            }
            this.setState({scholarship});
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
                if (!scholarship.is_editable) {
                    this.disableScholarshipInputs();
                }
                this.setState({ scholarship }, () => {
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
            event.stopPropagation(); // https://github.com/facebook/react/issues/3446#issuecomment-82751540
        }


        if (eventName==='location') {
            const { locationData } = this.state;
            const newLocation = transformLocation(event.target.value);

            locationData.push(newLocation);
            this.setState({locationData});

            if (autoSaveTimeoutId) {
                clearTimeout(autoSaveTimeoutId);
            }
            autoSaveTimeoutId = setTimeout(() => {
                // Runs 1 second (1000 ms) after the last change
                this.autoSaveScholarship();
            }, 1000);
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

    updateScholarship = (scholarship, isAutoSaving = true) => {
        this.setState({scholarship}, () => {
            if (isAutoSaving) {
                if (autoSaveTimeoutId) {
                    clearTimeout(autoSaveTimeoutId);
                }
                autoSaveTimeoutId = setTimeout(() => {
                    // Runs 1 second (1000 ms) after the last change
                    this.autoSaveScholarship();
                }, 1000);
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

        const { isAddScholarshipMode, locationData } = this.state;
        const { userProfile } = this.props;

        if(!userProfile) {
            toastNotify(`⚠️ Warning, you must be logged in to add a scholarship`);
            return;
        }
        let postResponsePromise;

        if(isAddScholarshipMode) {
            postResponsePromise = ScholarshipsAPI.create(scholarship,locationData)
        } else {
            postResponsePromise = ScholarshipsAPI.put(scholarship.id, scholarship, locationData);
        }
        postResponsePromise
            .then(res => {
                const savedScholarship = ScholarshipsAPI.cleanScholarship(res.data);
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

                this.setState({isAddScholarshipMode: false});
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

    render() {

        const { scholarship, isAddScholarshipMode, scholarshipPostError,
            isLoadingScholarship, pageNumber, locationData, errorLoadingScholarship, contributor } = this.state;
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
            },
            {
                title: 'Eligibility',
            },
            {
                title: 'Specific Questions',
            },
            {
                title: 'Funding',
            },
        ];
        scholarshipEditPages = scholarshipEditPages.slice(0, is_atila_direct_application ? scholarshipEditPages.length : 2);

        const scholarshipSteps = (<Steps current={pageNumber-1} onChange={(current) => this.changePage(current+1)}>
            { scholarshipEditPages.map(item => (
                <Step key={item.title} title={item.title} />
            ))}
        </Steps>);

        const title = isAddScholarshipMode ? 'Add Scholarship' : 'Edit Scholarship';
        const helmetTitle = `${title}${scholarship? ": " + scholarship.name : ""}`;
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
                        {pageNumber === 1 &&
                        <div className="my-3">
                            <FormDynamic model={scholarship}
                                         inputConfigs={scholarshipFormConfigsPage1}
                                         onUpdateForm={this.updateForm}
                                         formError={scholarshipPostError}
                                         onSubmit={this.submitForm}/>
                        </div>
                        }
                        {pageNumber === 2 &&
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

                        </div>}
                        {pageNumber === 3 &&
                        <div className="mt-3 mb-5 scholarship-specific-questions">
                            <h3>User Profile Questions</h3>
                                <ScholarshipUserProfileQuestionBuilder scholarship={scholarship}
                                                                       onUpdate={this.updateForm} />
                                <hr/>
                            <h3>Scholarship Specific Questions</h3>
                                <ScholarshipQuestionBuilder scholarship={scholarship}
                                                            onUpdate={this.updateForm} />
                        </div>}
                        {pageNumber === 4 &&
                        <div className="my-3">
                            <PaymentSend scholarship={scholarship}
                                         onFundingComplete={this.onFundingComplete}
                                         contributor={contributor}
                                         contributorFundingAmount={Number.parseInt(scholarship.funding_amount)} />
                        </div>
                        }
                        <div className="my-2" style={{clear: 'both'}}>
                            {pageNumber < scholarshipEditPages.length &&
                            <button className="btn btn-outline-primary float-right col-md-6"
                                    onClick={() => this.changePage(pageNumber+1)}>Next</button>}
                            {pageNumber > 1 &&
                            <button className="btn btn-outline-primary float-left col-md-6"
                                    onClick={() => this.changePage(pageNumber-1)}>Prev</button>}
                        </div>
                        <hr/>

                        {scholarshipSteps}

                        <hr/>

                        {!isAddScholarshipMode && updatedAtDate }
                        {isAddScholarshipMode &&
                            <button type="submit"
                                    className="btn btn-primary col-12 mt-2"
                                    onClick={this.submitForm}>
                                Save
                            </button>
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