import React from 'react';
import {Helmet} from "react-helmet";
import FormDynamic from "../../components/FormDynamic";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {connect} from "react-redux";
import {slugify} from "../../services/utils";
import Loading from "../../components/Loading";
import {SCHOOLS_LIST} from "../../models/Constants";
import ReactSnackBar from "react-js-snackbar";

const scholarshipFormConfigs = [
    {
        keyName: 'name',
        placeholder: 'Scholarship Name',
        type: 'text',
        html: (model) => (
            <p className="text-muted">{model.slug}</p>
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
        placeholder: 'Funding Amount',
        type: 'number',
    },
    {
        keyName: 'deadline',
        placeholder: 'Deadline',
        type: 'datetime-local',
        html: () =>(<label htmlFor="deadline">
            Deadline
        </label>),
    },
    {
        keyName: 'female_only',
        placeholder: 'Female Only?',
        type: 'checkbox',
    },
    {
        keyName: 'international_students_eligible',
        placeholder: 'International Students Eligible?',
        type: 'checkbox',
    },
    {
        keyName: 'eligible_schools',
        placeholder: 'Enter your school',
        type: 'autocomplete',
        suggestions: SCHOOLS_LIST
    },
];

class ScholarshipAddEdit extends React.Component{

    constructor(props) {
        super(props);

        const now = new Date();

        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().length === 1 ? '0' + (now.getMonth() + 1).toString() : now.getMonth() + 1;
        const date = now.getDate().toString().length === 1 ? '0'         + (now.getDate()).toString()      : now.getDate();

        const formattedDateTime = `${year}-${month}-${date}T23:59:00`;
        this.state = {
            scholarship: {
                name: '',
                slug: '',
                description: '',
                img_url: '',
                scholarship_url: '',
                form_url:'',
                deadline: formattedDateTime,
                funding_amount: '',
                funding_type: ['Scholarship'],
                female_only: false,
                international_students_eligible: false,
                no_essay_required: false,
                eligible_schools: [],
            },
            isAddScholarshipMode: false,
            scholarshipPostError: null,
            isLoadingScholarship: true,
            errorLoadingScholarship: false,
            isResponseOk: null,
        };
    }

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
                const scholarship = res.data;
                scholarship.deadline = scholarship.deadline.substring(0, scholarship.deadline.length - 1);
                this.setState({ scholarship: res.data });
            })
            .catch(err => {
                this.setState({ errorLoadingScholarship: true });
            })
            .finally(() => {
                this.setState({ isLoadingScholarship: false });
                this.setState({ prevSlug: slug });
            });
    };

    updateForm = (event) => {
        event.preventDefault();
        const scholarship = this.state.scholarship;

        const value = event.target.value;
        if (Array.isArray(scholarship[event.target.name])) {
            scholarship[event.target.name].push(value);
        } else {
            scholarship[event.target.name] =value;
        }

        if(event.target.name==='name') {
            scholarship.slug = slugify(event.target.value,{lower: true});
        }

        this.setState({scholarship});
    };

    show = () => {
        if (this.state.Showing) return;

        this.setState({ Show: true, Showing: true });
        setTimeout(() => {
            this.setState({ Show: false, Showing: false });
        }, 2000);
    };

    submitForm = (event) => {
        event.preventDefault();
        const scholarship = ScholarshipsAPI.cleanScholarshipBeforeCreate(this.state.scholarship);
        this.setState({scholarship});

        const { isAddScholarshipMode } = this.state;

        const postData = {scholarship,locationData: {}};
        let postResponsePromise = null;

        if(isAddScholarshipMode) {
            postResponsePromise = ScholarshipsAPI.create(postData)
        } else {
            postResponsePromise = ScholarshipsAPI.put(scholarship.id, postData);
        }
        postResponsePromise
            .then(res=> {
            })
            .catch(err=> {
                console.log({err});
                this.setState({scholarshipPostError: err.response && err.response.data})
            })
            .finally(()=>{});

    };

    render() {

        const { scholarship, isAddScholarshipMode, scholarshipPostError, isLoadingScholarship } = this.state;

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
                        <FormDynamic model={scholarship}
                                     inputConfigs={scholarshipFormConfigs}
                                     onUpdateForm={this.updateForm}
                                     formError={scholarshipPostError}
                                     onSubmit={this.submitForm}/>
                    </div>
                    Click here to: <input type="button" value="Show" onClick={this.show} />
                    <ReactSnackBar Icon={<span>🦄</span>} Show={this.state.Show}>
                        Hello there, nice to meet you!
                    </ReactSnackBar>
                </div>
            </React.Fragment>
        );

    }
}

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(ScholarshipAddEdit);