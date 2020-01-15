import React from "react";
import PropTypes from "prop-types";
import { Modal} from 'antd';

class ScholarshipQuestionAddEditModal extends React.Component {

    handleOk = e => {
        const {updateQuestion, question} = this.props;
        updateQuestion(question);
    };

    handleCancel = e => {
        const {updateQuestion} = this.props;
        updateQuestion(null);
    };

    updateForm = event => {
        event.preventDefault();
        const {updateQuestion, question} = this.props;
        question[event.target.name] = event.target.value;
        updateQuestion(question, false);
    };

    render() {

        const {visible, question} = this.props;

        const dynamicFormTypes = ['file', 'textfield', 'textarea'];
        return (
            <div>
                <Modal
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className="p-3">
                        <input className="col-12 mb-3 form-control"
                               placeholder="Question Key"
                               value={question.key} name="key"
                               onChange={this.updateForm}/>
                        <input className="col-12 mb-3 form-control"
                               placeholder="Question Label"
                               value={question.label} name="label"
                               onChange={this.updateForm}/>
                        <input className="col-12 mb-3 form-control"
                               placeholder="Question CSS Selector"
                               value={question.web_form_selector} name="web_form_selector"
                               onChange={this.updateForm}/>
                        <select className="col-12 mb-3 form-control"
                                placeholder="Question Type"
                                value={question.type||''} name="type"
                                onChange={this.updateForm}>
                            <option key='' disabled hidden>{''}</option>
                            {dynamicFormTypes.map(item =><option key={item}>{item}</option>)}
                        </select>
                    </div>

                </Modal>
            </div>
        );
    }
}

ScholarshipQuestionAddEditModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    question: PropTypes.shape({}).isRequired,
    updateQuestion: PropTypes.func.isRequired,
};

export default ScholarshipQuestionAddEditModal;