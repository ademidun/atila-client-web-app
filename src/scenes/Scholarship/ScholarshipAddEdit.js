import React from 'react';
import ScholarshipAddEditForm from "./ScholarshipAddEditForm";
import {Helmet} from "react-helmet";

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
                application_form_url:'',
                deadline: '',
                funding_amount: '',
                female_only: false,
                international_students_eligible: false,
                no_essay_required: false,
            },
            isAddScholarshipMode: false,
        };
        console.log({props});
    }

    updateForm = (event) => {
        event.preventDefault();
        const scholarship = this.state.scholarship;
        scholarship[event.target.name] = event.target.value;
        this.setState({scholarship});
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
                        <ScholarshipAddEditForm
                            onUpdateForm={this.updateForm}
                            scholarship={scholarship} />
                    </div>
                </div>
            </React.Fragment>
        );

    }
}

export default ScholarshipAddEdit;