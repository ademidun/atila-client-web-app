import React from 'react';
import PropTypes from 'prop-types';

class ScholarshipAddEditForm extends React.Component {

    render() {

        const { onUpdateForm, scholarship : {
            name, description,scholarship_url, img_url, deadline, funding_amount,
            female_only,
        } } = this.props;
        return (
            <form className="row p-3 form-group" onSubmit={this.submitForm}>
                <input placeholder="Name of Scholarship"
                       className="col-12 mb-3 form-control"
                       name="name"
                       value={name}
                       onChange={onUpdateForm}
                />
                <label htmlFor="description">
                    Short Description: Who is eligible for this scholarship?
                    What should they do to apply?
                    You will be able to give more details later.
                </label>
                <textarea placeholder="Scholarship Description"
                          className="col-12 mb-3 form-control"
                          name="description"
                          value={description}
                          onChange={onUpdateForm}
                />
                <input placeholder="Scholarship Url"
                       className="col-12 mb-3 form-control"
                       name="scholarship_url"
                       value={scholarship_url}
                       onChange={onUpdateForm}
                />
                <input placeholder="Scholarship Image Url"
                       className="col-12 mb-3 form-control"
                       name="img_url"
                       value={img_url}
                       onChange={onUpdateForm}
                />
                <input placeholder="Deadline"
                       className="col-12 mb-3 form-control"
                       name="deadline"
                       value={deadline}
                       type="datetime-local"
                       onChange={onUpdateForm}
                />
                <input placeholder="Funding Amount"
                       className="col-12 mb-3 form-control"
                       name="funding_amount"
                       type="number"
                       value={funding_amount}
                       onChange={onUpdateForm}
                />
                <label htmlFor="female_only">
                    Female Only
                </label>
                <input placeholder="Female Only?"
                       className="col-12 mb-3 form-control"
                       name="female_only"
                       type="checkbox"
                       value={female_only}
                       onChange={onUpdateForm}
                />
            </form>
        )
    }
}



ScholarshipAddEditForm.defaultProps = {
    className: '',
};

ScholarshipAddEditForm.propTypes = {
    onUpdateForm: PropTypes.func.isRequired,
    scholarship: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
};

export default ScholarshipAddEditForm;