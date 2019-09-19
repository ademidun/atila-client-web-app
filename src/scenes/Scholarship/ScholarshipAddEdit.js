import React from 'react';
import {Helmet} from "react-helmet";
import FormDynamic from "../../components/FormDynamic";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {connect} from "react-redux";
import {slugify} from "../../services/utils";

const scholarshipFormConfigs = [
    {
        key: 'name',
        placeholder: 'Scholarship Name',
        type: 'text',
        html: (model) => (
            <p className="text-muted">{model.slug}</p>
        )
    },
    {
        key: 'description',
        type: 'textarea',
        placeholder: 'Scholarship Description',
        html: () => (<label htmlFor="description">
            Short Description: Who is eligible for this scholarship?
            What should they do to apply?
            You will be able to give more details later.
        </label>),
    },
    {
        key: 'scholarship_url',
        placeholder: 'Scholarship Url',
        type: 'url',
    },
    {
        key: 'form_url',
        placeholder: 'Application Form URL',
        type: 'url',
    },
    {
        key: 'img_url',
        placeholder: 'Scholarship Image URL',
        type: 'url',
    },
    {
        key: 'funding_amount',
        placeholder: 'Funding Amount',
        type: 'number',
    },
    {
        key: 'deadline',
        placeholder: 'Deadline',
        type: 'datetime-local',
        html: () =>(<label htmlFor="deadline">
            Deadline
        </label>),
    },
    {
        key: 'female_only',
        placeholder: 'Female Only?',
        type: 'checkbox',
    },
    {
        key: 'international_students_eligible',
        placeholder: 'International Students Eligible?',
        type: 'checkbox',
    },
];

class ScholarshipAddEdit extends React.Component{

    constructor(props) {
        super(props);

        const now = new Date();

        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().length === 1 ? '0' + (now.getMonth() + 1).toString() : now.getMonth() + 1;
        const date = now.getDate().toString().length === 1 ? '0'         + (now.getDate()).toString()      : now.getDate();

        const formattedDateTime = year + '-' + month + '-' + date + 'T' + 23 + ':' + 59 + ':' + '00';
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
            },
            isAddScholarshipMode: false,
            scholarshipPostError: null,
        };
    }

    componentDidMount() {
        console.log('componentDidMount');

        const { userProfile } = this.props;
        console.log('this.props', this.props);

        const { match : { path }} = this.props;

        if ( path==='/scholarship/add' ) {
            this.setState({isAddScholarshipMode: true})
        }
        const scholarship = this.state.scholarship;
        scholarship.owner = userProfile.user;
        this.setState({scholarship});
    }

    updateForm = (event) => {
        event.preventDefault();
        const scholarship = this.state.scholarship;
        scholarship[event.target.name] = event.target.value;

        if(event.target.name==='name') {
            scholarship.slug = slugify(event.target.value,{lower: true});
        }
        this.setState({scholarship});
    };

    submitForm = (event) => {
        event.preventDefault();
        const scholarship = ScholarshipsAPI.cleanScholarshipBeforeCreate(this.state.scholarship);
        console.log({scholarship});
        this.setState({scholarship});
        ScholarshipsAPI.create({scholarship,locationData: {}})
            .then(res=> {
                console.log({res});
            })
            .catch(err=> {
                console.log({err});
                this.setState({scholarshipPostError: err.response && err.response.data})
            })
            .finally(()=>{})

    };

    render() {

        const { scholarship, isAddScholarshipMode, scholarshipPostError } = this.state;

        const title = isAddScholarshipMode ? 'Add Scholarship' : 'Edit Scholarship';
        return (
            <React.Fragment>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{title} - Atila</title>
                </Helmet>
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        <h1>{title}: {scholarship.name}</h1>
                        <FormDynamic model={scholarship}
                                     inputConfigs={scholarshipFormConfigs}
                                     onUpdateForm={this.updateForm}
                                     formError={scholarshipPostError}
                                     onSubmit={this.submitForm}/>
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