import React from "react";
import PropTypes from "prop-types";
import { Modal} from 'antd';

class ScholarshipQuestionAddEditModal extends React.Component {
    constructor(props) {
        super(props);

        const { visible } = props;
        this.state = {
            visible,
        }
    }

    handleOk = e => {
        const {updateQuestion, question} = this.props;
        updateQuestion(question);

        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        const {updateQuestion} = this.props;
        updateQuestion(null);
        this.setState({visible: false});
    };

    updateForm = event => {
        event.preventDefault();
        const {updateQuestion, question} = this.props;
        question[event.target.name] = event.target.value;
        updateQuestion(question, false);
    };

    render() {

        const {visible, question} = this.props;
        return (
            <div>
                <Modal
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className="p-3">
                        <input placeholder="Question Key"
                               value={question.key} name="key"
                               onChange={this.updateForm}/>
                        <input placeholder="Question Label"
                               value={question.label} name="label"
                               onChange={this.updateForm}/>
                        <input placeholder="Question CSS Selector"
                               value={question.web_form_selector} name="web_form_selector"
                               onChange={this.updateForm}/>
                        <select placeholder="Question Type"
                                value={question.type} name="type"
                                onChange={this.updateForm}>
                            <option key="file">File</option>
                            <option key="textfield">textfield</option>
                            <option key="textarea">textarea</option>
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