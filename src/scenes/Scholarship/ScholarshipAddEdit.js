import React from 'react';
import {Helmet} from "react-helmet";
import FormDynamic from "../../components/Form/FormDynamic";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {connect} from "react-redux";
import {prettifyKeys, slugify, transformLocation} from "../../services/utils";
import Loading from "../../components/Loading";
import {MAJORS_LIST, SCHOOLS_LIST} from "../../models/ConstantsForm";
import {scholarshipUserProfileSharedFormConfigs, toastNotify} from "../../models/Utils";
import {defaultScholarship} from "../../models/Scholarship";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
            scholarship: defaultScholarship,
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
            scholarship.owner = userProfile.user;
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

    initializeLocations = () => {
        // See createLocations() int edit-scholarship or add-scholarship.component.ts
        const { scholarship, locationData } = this.state;

        for (var index = 0; index <scholarship.country.length; index++) {
            var element =scholarship.country[index];
            locationData.push({
                'country': element.name
            });
        }

        for (var index = 0; index <scholarship.province.length; index++) {
            var element =scholarship.province[index];
            locationData.push({
                'country': element.country,
                'province':element.name
            });
        }

        for (var index = 0; index <scholarship.city.length; index++) {
            var element =scholarship.city[index];
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
        event.preventDefault();

        if (event.target.name==='location') {
            const { locationData } = this.state;
            const newLocation = transformLocation(event.target.value);

            locationData.push(newLocation);
            this.setState({locationData});

        } else {
            const scholarship = this.state.scholarship;

            const value = event.target.value;

            if ( Array.isArray(scholarship[event.target.name]) && !Array.isArray(value) ) {
                scholarship[event.target.name].push(value);
            } else {
                scholarship[event.target.name] =value;
            }

            if(event.target.name==='name') {
                scholarship.slug = slugify(event.target.value,{lower: true});
            }
            this.setState({scholarship});
        }

    };

    submitForm = (event) => {
        event.preventDefault();
        const scholarship = ScholarshipsAPI.cleanScholarship(this.state.scholarship);
        this.setState({scholarship});

        const { isAddScholarshipMode, locationData } = this.state;

        const postData = {scholarship,locationData};
        let postResponsePromise = null;

        if(isAddScholarshipMode) {
            postResponsePromise = ScholarshipsAPI.create(postData)
        } else {
            postResponsePromise = ScholarshipsAPI.put(scholarship.id, postData);
        }
        postResponsePromise
            .then(res => {
                toastNotify('😃 Scholarship successfully saved!');
                console.log({res});
                this.setState({isAddScholarshipMode: false});
                const scholarship = ScholarshipsAPI.cleanScholarship(res.data);
                this.setState({ scholarship });
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

        const title = isAddScholarshipMode ? 'Add Scholarship' : 'Edit Scholarship';
        return (
            <React.Fragment>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{title} - Atila</title>
                </Helmet>
                <div className="container mt-5">
                    {isLoadingScholarship && <Loading  title="Loading Scholarships..."/>}
                    <div className="card shadow p-3">
                        <h1>{title}: {scholarship.name}</h1>
                        {pageNumber === 1 &&
                        <React.Fragment>
                            <FormDynamic model={scholarship}
                                         inputConfigs={scholarshipFormConfigsPage1}
                                         onUpdateForm={this.updateForm}
                                         formError={scholarshipPostError}
                                         onSubmit={this.submitForm}/>
                            <table class="table">
                                <caption >Locations</caption>
                                <thead>
                                <tr>
                                    {['city','province','country'].map(location =>
                                        <th>{prettifyKeys(location)}</th>)
                                    }
                                </tr>
                                </thead>
                                <tbody>

                                </tbody>
                                {locationData.map((locationItem, index) => <tr>
                                        {['city','province','country'].map(location =><td>{locationItem[location]}</td>)}
                                        <button className="btn btn-outline-primary"
                                                onClick={()=> this.removeLocationData(index)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </tr>
                                )}


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
                        <div className="my-2" style={{clear: 'both'}}>
                            {pageNumber !== 2 &&
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
            </React.Fragment>
        );

    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipAddEdit);