import React from 'react';
import {Helmet} from "react-helmet";
import FormDynamic from "../../components/Form/FormDynamic";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {connect} from "react-redux";
import {nestedFieldUpdate, prettifyKeys, slugify, transformLocation} from "../../services/utils";
import Loading from "../../components/Loading";
import {MAJORS_LIST, SCHOOLS_LIST} from "../../models/ConstantsForm";
import {scholarshipUserProfileSharedFormConfigs, toastNotify} from "../../models/Utils";
import {DEFAULT_SCHOLARSHIP} from "../../models/Scholarship";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import {Button, Popover, Steps, Tag} from "antd";
import ScholarshipQuestionBuilder, {ScholarshipUserProfileQuestionBuilder} from "./ScholarshipQuestionBuilder";
import PaymentSend from "../Payment/PaymentSend/PaymentSend";
const { Step } = Steps;

const atilaDirectApplicationsPopover = (
    <div>
        Atila Direct Applications provides the following features:
        <ul>
            <li>
                Handle the payment transfer from sponsor to scholarship recipient
            </li>
            <li>
                Promoting your scholarship to our network of students and student organizations.
            </li>
            <li>
                Automatically notify winners and non-winners.
            </li>
            <li>
                Simple interface for managing all applications.
            </li>
        </ul>
        <Link to="/start">Learn More</Link>

    </div>
);

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
            Eligibility: Who is eligible for this scholarship?
        </label>),
    },
    {
        keyName: 'is_atila_direct_application',
        placeholder:(
            <Popover content={atilaDirectApplicationsPopover} title="What is Atila Direct Applications?">
                Allow applicants to directly apply for scholarship through Atila?{' '}<small>Hover to learn more</small>
                {' '}<Tag color="green">new</Tag>
            </Popover>
            ),
        type: 'checkbox',
        className: 'font-weight-bold',
    },
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
        type: 'url',
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
        html: () =>(<label htmlFor="deadline">
            Deadline <span role="img" aria-label="clock emoji">🕐</span>
        </label>),
    },

    // {
    //     keyName: 'metadata.not_open_yet',
    //     placeholder: 'Scholarship not open yet?',
    //     type: 'checkbox',
    // },
    // {
    //     keyName: 'open_date',
    //     type: 'date',
    //     isHidden: (scholarship) => (scholarship.metadata && !scholarship.metadata.not_open_yet),
    //     html: () =>(<label htmlFor="open_date">
    //         When does the scholarship open? <span role="img" aria-label="calendar emoji">🗓</span>
    //     </label>),
    // },
    // {
    //     keyName: 'is_not_available',
    //     placeholder: 'Is not available?',
    //     type: 'checkbox',
    // },
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

class ScholarshipAddEdit extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            scholarship: DEFAULT_SCHOLARSHIP,
            isAddScholarshipMode: false,
            scholarshipPostError: null,
            isLoadingScholarship: true,
            errorLoadingScholarship: false,
            pageNumber: 1,
            locationData: [],
        };
    }

    changePage = (pageNumber) => {
        this.setState({pageNumber})
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
                const scholarship = ScholarshipsAPI.cleanScholarship(res.data);
                this.setState({ scholarship }, () => {
                    this.initializeLocations();
                });
            })
            .catch(err => {
                this.setState({ errorLoadingScholarship: true });
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

    updateForm = (event) => {
        let value = event.target.value;

        if (event.target.type==='checkbox'){
            value = event.target.checked
        }
        if (event.stopPropagation) {
            event.stopPropagation(); // https://github.com/facebook/react/issues/3446#issuecomment-82751540
        }
        if (event.target.name==='location') {
            const { locationData } = this.state;
            const newLocation = transformLocation(event.target.value);

            locationData.push(newLocation);
            this.setState({locationData});

        }
        else if (event.target.name.includes('.')) {
            const scholarship = nestedFieldUpdate(this.state.scholarship, event.target.name, value);
            this.setState({scholarship});
        }
        else {
            const scholarship = this.state.scholarship;

            if ( Array.isArray(scholarship[event.target.name]) && !Array.isArray(value) ) {
                scholarship[event.target.name].push(value);
            } else {
                scholarship[event.target.name] =value;
            }

            if(event.target.name==='name') {
                scholarship.slug = slugify(event.target.value);
            }
            this.updateScholarship(scholarship);
        }

    };

    updateScholarship = (scholarship) => {
        this.setState({scholarship});
    };

    publishScholarship = (event) => {
        event.preventDefault();
        const { scholarship } = this.state;
        this.setState({isLoadingScholarship: true});
        ScholarshipsAPI
            .patch(scholarship.id, {published: true})
            .then(res => {
                const { data: scholarship} = res;
                this.updateScholarship(scholarship);
            })
            .catch(err => {
                console.log({err});
            })
            .finally(() => {
                this.setState({isLoadingScholarship: false});
            })
    };

    submitForm = (event) => {
        event.preventDefault();
        const scholarship = ScholarshipsAPI.cleanScholarship(this.state.scholarship);
        this.setState({scholarship});

        const { isAddScholarshipMode, locationData } = this.state;
        const { userProfile } = this.props;

        if(!userProfile) {
            toastNotify(`⚠️ Warning, you must be logged in to add a scholarship`);
            return;
        }
        let postResponsePromise = null;

        if(isAddScholarshipMode) {
            postResponsePromise = ScholarshipsAPI.create(scholarship,locationData)
        } else {
            postResponsePromise = ScholarshipsAPI.put(scholarship.id, scholarship, locationData);
        }
        postResponsePromise
            .then(res => {
                this.setState({isAddScholarshipMode: false});
                const savedScholarship = ScholarshipsAPI.cleanScholarship(res.data);
                const successMessage = (<p>
                    <span role="img" aria-label="happy face emoji">🙂</span>
                    Successfully saved {' '}
                    <Link to={`/scholarship/${savedScholarship.slug}`}>
                        {savedScholarship.name}
                    </Link>
                </p>);

                toastNotify(successMessage, 'info', {position: 'bottom-right'});
                this.setState({ scholarship: savedScholarship });
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
            isLoadingScholarship, pageNumber, locationData } = this.state;
        const { userProfile } = this.props;

        const { is_atila_direct_application } = scholarship;


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

        // BETA MODE: Only show the Atila direct Applications stuff to is_debug_mode users
        if (!userProfile || !userProfile.is_debug_mode) {
            scholarshipFormConfigsPage1 = scholarshipFormConfigsPage1.filter((formConfig) => formConfig.keyName !== "is_atila_direct_application");

            scholarshipEditPages = scholarshipEditPages.slice(0, 2);
        } else {
            scholarshipEditPages = scholarshipEditPages.slice(0, is_atila_direct_application ? scholarshipEditPages.length : 2);
        }

        const scholarshipSteps = (<Steps current={pageNumber-1} progressDot  onChange={(current) => this.changePage(current+1)}>
            { scholarshipEditPages.map(item => (
                <Step key={item.title} title={item.title} />
            ))}
        </Steps>);

        const title = isAddScholarshipMode ? 'Add Scholarship' : 'Edit Scholarship';
        return (
            <div className="ScholarshipAddEdit">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{title} - Atila</title>
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
                        <div className="my-3">
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
                        <div className="mt-3 mb-5">
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
                            <PaymentSend scholarship={scholarship} updateScholarship={this.updateScholarship} />
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

                        <button type="submit"
                                className="btn btn-primary col-12 mt-2"
                                onClick={this.submitForm}>Save</button>

                        {!scholarship.published && scholarship.is_atila_direct_application &&
                        <Button
                            type="primary"
                            className="col-12 mt-2"
                            onClick={this.publishScholarship}
                            disabled={!scholarship.is_funded}>
                            Publish {!scholarship.is_funded ?
                            <React.Fragment><br/>(You must fund scholarship before publishing)</React.Fragment>:
                            ""}
                        </Button>
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