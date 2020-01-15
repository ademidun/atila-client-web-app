import React from 'react';
import {Helmet} from "react-helmet";
import FormDynamic from "../../components/Form/FormDynamic";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {connect} from "react-redux";
import {nestedFieldUpdate, prettifyKeys, slugify, transformLocation} from "../../services/utils";
import Loading from "../../components/Loading";
import {MAJORS_LIST, SCHOOLS_LIST} from "../../models/ConstantsForm";
import {scholarshipUserProfileSharedFormConfigs, toastNotify} from "../../models/Utils";
import {defaultScholarship} from "../../models/Scholarship";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import './ScholarshipAddEdit.scss';
import ScholarshipAutomationBuilder from "./ScholarshipAutomationBuilder";
import {updateScholarshipCurrentlyEditing} from "../../redux/actions/scholarship";
import PropTypes from "prop-types";

const scholarshipFormConfigsPage1 = [
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
            Short Description: Who is eligible for this scholarship?
            What should they do to apply?
            You will be able to give more details later.
        </label>),
    },
    {
        keyName: 'scholarship_url',
        placeholder: 'Scholarship Url',
        type: 'url',
    },
    {
        keyName: 'form_url',
        placeholder: 'Application Form URL',
        type: 'url',
    },
    {
        keyName: 'img_url',
        placeholder: 'Scholarship Image URL',
        type: 'url',
    },
    {
        keyName: 'funding_amount',
        placeholder: 'Funding Amount 💵 🤑',
        type: 'number',
    },
    {
        keyName: 'deadline',
        type: 'datetime-local',
        html: () =>(<label htmlFor="deadline">
            Deadline <span role="img" aria-label="clock emoji">🕐</span>
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
        keyName: 'female_only',
        placeholder: 'Female Only? 🙍🏿',
        type: 'checkbox',
    },
    {
        keyName: 'is_not_available',
        placeholder: 'Is not available?',
        type: 'checkbox',
    },
    {
        keyName: 'international_students_eligible',
        placeholder: 'International Students Eligible? 🌏',
        type: 'checkbox',
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
        keyName: 'email_contact',
        placeholder: 'Email address for sending questions and submissions',
        type: 'email',
    },
    {
        keyName: 'location',
        placeholder: 'Enter city, province, country 🌏',
        html: () =>(<label htmlFor="location">
            Is the scholarship limited to certain locations? <span role="img" aria-label="globe emoji">🌏</span>
        </label>),
        type: 'location',
    },
];

class ScholarshipAddEdit extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
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

        const { userProfile, updateScholarshipCurrentlyEditing } = this.props;

        const { match : { path }} = this.props;

        if ( path==='/scholarship/add' ) {
            this.setState({isAddScholarshipMode: true});
            this.setState({isLoadingScholarship: false});
            const scholarship = defaultScholarship;

            if(userProfile) {
                scholarship.owner = userProfile.user;
            }
            else {
                toastNotify(`⚠️ Warning, you must be logged in to add a scholarship`);
            }
            updateScholarshipCurrentlyEditing(scholarship);
        } else {
            this.loadContent();
        }
    }

    loadContent = () => {

        this.setState({ isLoadingScholarship: true });
        const { match : { params : { slug }}, updateScholarshipCurrentlyEditing } = this.props;
        ScholarshipsAPI.getSlug(slug)
            .then(res => {
                const scholarship = ScholarshipsAPI.cleanScholarship(res.data);
                updateScholarshipCurrentlyEditing(scholarship);
                this.initializeLocations();
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
        const { locationData } = this.state;
        const { scholarship } = this.props;

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

        const { updateScholarshipCurrentlyEditing } = this.props;

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
            const scholarship = nestedFieldUpdate(this.props.scholarship, event.target.name, value);
            updateScholarshipCurrentlyEditing(scholarship);
        }
        else {
            const {scholarship} = this.props;

            if ( Array.isArray(scholarship[event.target.name]) && !Array.isArray(value) ) {
                scholarship[event.target.name].push(value);
            } else {
                scholarship[event.target.name] =value;
            }

            if(event.target.name==='name') {
                scholarship.slug = slugify(event.target.value,{lower: true});
            }
            updateScholarshipCurrentlyEditing(scholarship);
        }

    };

    submitForm = (event) => {
        const { updateScholarshipCurrentlyEditing } = this.props;

        event.preventDefault();
        const scholarship = ScholarshipsAPI.cleanScholarship(this.props.scholarship);
        updateScholarshipCurrentlyEditing(scholarship);

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
                updateScholarshipCurrentlyEditing(savedScholarship);
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

        const { isAddScholarshipMode, scholarshipPostError,
            isLoadingScholarship, pageNumber, locationData } = this.state;
        const { userProfile, scholarship } = this.props;

        console.log({scholarship});

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
                        {!userProfile &&
                        <h4>
                            <span role="img" aria-label="warning emoji">
                                ⚠️
                            </span> Warning, you must be logged in to add a scholarship
                        </h4>
                        }
                        {scholarship.slug && !isAddScholarshipMode &&
                        <Link to={`/scholarship/${scholarship.slug}`}>
                            View Scholarship
                        </Link>
                        }
                        {pageNumber === 1 &&
                        <React.Fragment>
                            <FormDynamic model={scholarship}
                                         inputConfigs={scholarshipFormConfigsPage1}
                                         onUpdateForm={this.updateForm}
                                         formError={scholarshipPostError}
                                         onSubmit={this.submitForm}/>
                            <table className="table">
                                <caption >Locations</caption>
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
                        </React.Fragment>
                        }
                        {pageNumber === 2 &&
                        <React.Fragment>
                            <h6>Leave blank for each criteria that is open to any</h6>
                            <FormDynamic model={scholarship}
                                         inputConfigs={scholarshipUserProfileSharedFormConfigs}
                                         onUpdateForm={this.updateForm}
                                         formError={scholarshipPostError}
                                         onSubmit={this.submitForm}
                            />

                        </React.Fragment>}
                        {pageNumber === 3 &&
                        <React.Fragment>
                            { scholarship && <ScholarshipAutomationBuilder scholarship={scholarship}/>}
                        </React.Fragment>}
                        <div className="my-2" style={{clear: 'both'}}>
                            {pageNumber !== 3 &&
                            <button className="btn btn-outline-primary float-right col-md-6"
                                    onClick={() => this.changePage(pageNumber+1)}>Next</button>}
                            {pageNumber !== 1 &&
                            <button className="btn btn-outline-primary float-left col-md-6"
                                    onClick={() => this.changePage(pageNumber-1)}>Prev</button>}
                        </div>

                        <button type="submit"
                                className="btn btn-primary col-12 mt-2"
                                onClick={this.submitForm}>Save</button>
                    </div>
                </div>
            </div>
        );

    }
}
const mapDispatchToProps = {
    updateScholarshipCurrentlyEditing,
};

const mapStateToProps = state => {
    return {
        userProfile: state.data.user.loggedInUserProfile,
        scholarship: state.data.scholarship.scholarshipCurrentlyEditing,
    };
};

ScholarshipAddEdit.defaultProps = {
    // redux
    userProfile: null,
    scholarship: null,
};

ScholarshipAddEdit.propTypes = {
    // redux
    userProfile: PropTypes.shape({}),
    scholarship: PropTypes.shape({}),
    updateScholarshipCurrentlyEditing: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ScholarshipAddEdit);