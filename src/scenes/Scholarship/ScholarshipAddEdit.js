import React from 'react';
import {Helmet} from "react-helmet";
import FormDynamic from "../../components/FormDynamic";
import ScholarshipsAPI from "../../services/ScholarshipsAPI";
import {connect} from "react-redux";


const scholarshipFormConfigs = [
    {
        key: 'name',
        placeholder: 'Scholarship Name',
        type: 'text',
    },
    {
        key: 'description',
        type: 'textarea',
        placeholder: 'Scholarship Description',
        html: (<label htmlFor="description">
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
        html: (<label htmlFor="deadline">
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
        this.state = {
            scholarship: {
                name: '',
                slug: '',
                description: '',
                img_url: '',
                scholarship_url: '',
                form_url:'',
                deadline: '',
                funding_amount: '',
                female_only: false,
                international_students_eligible: false,
                no_essay_required: false,
            },
            isAddScholarshipMode: false,
        };
    }

    componentDidMount() {
        console.log('componentDidMount');

        const { userProfile } = this.props;
        const scholarship = this.state.scholarship;
        scholarship.owner = userProfile.user;
        this.setState({scholarship});
    }

    updateForm = (event) => {
        event.preventDefault();
        const scholarship = this.state.scholarship;
        scholarship[event.target.name] = event.target.value;
        this.setState({scholarship});
    };

    submitForm = (event) => {
        event.preventDefault();
        const scholarship = this.state.scholarship;
        console.log({scholarship});

        ScholarshipsAPI.create({scholarship, locationData: {}})
            .then(res=> {
                console.log({res});
            })
            .catch(err=> {
                console.log({err});
            })
            .finally(()=>{})

    };

    render() {

        const { scholarship, isAddScholarshipMode } = this.state;
        return (
            <React.Fragment>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{isAddScholarshipMode ? 'Add': 'Edit'} Scholarship - Atila</title>
                </Helmet>
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        <h2>Scholarship Add Edit: {scholarship.name}</h2>
                        <FormDynamic model={scholarship}
                                     inputConfigs={scholarshipFormConfigs}
                                     onUpdateForm={this.updateForm}
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