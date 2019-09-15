import React from 'react';
import ScholarshipAddEditForm from "./ScholarshipAddEditForm";

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
                deadline: '',
                funding_amount: '',
                female_only: false,
            }
        }
    }

    updateForm = (event) => {
        event.preventDefault();
        const scholarship = this.state.scholarship;
        scholarship[event.target.name] = event.target.value;
        this.setState({scholarship});
    };

    render() {

        const { scholarship } = this.state;
        return (

            <div className="container mt-5">
                <div className="card shadow p-3">
                <h2>Scholarship Add Edit: {scholarship.name}</h2>
                <ScholarshipAddEditForm
                    onUpdateForm={this.updateForm}
                    scholarship={scholarship} />
            </div>
            </div>
        );

    }
}

export default ScholarshipAddEdit;