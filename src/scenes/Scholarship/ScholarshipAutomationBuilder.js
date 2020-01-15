import React from 'react';
import PropTypes from "prop-types";
import {Button, Table} from "antd";
import ScholarshipQuestionAddEditModal from "./ScholarshipQuestionAddEditModal";
import {updateScholarshipCurrentlyEditing} from "../../redux/actions/scholarship";
import {connect} from "react-redux";
import {arrayToDictionary} from "../../services/utils";

class ScholarshipAutomationBuilder extends React.Component{

    constructor(props) {
        super(props);

        const { scholarship } = props;
        console.log({scholarship, props});
        this.state = {
            scholarshipQuestions: Object.values(scholarship.extra_questions),
            isQuestionModalVisible: false,
            questionBeingEdited: null,
            indexBeingEdited: null,
        }
    }

    editQuestion = (indexBeingEdited) => {
        const { scholarshipQuestions } = this.state;
        const questionBeingEdited = scholarshipQuestions[indexBeingEdited];

        this.setState({questionBeingEdited, indexBeingEdited, isQuestionModalVisible: true});
    };

    updateQuestion = (question=null) => {

        if (question===null) {
            this.setState({isQuestionModalVisible: false});
            return;
        }
        const { scholarshipQuestions, indexBeingEdited } = this.state;
        const { updateScholarshipCurrentlyEditing, scholarship } = this.props;

        scholarshipQuestions[indexBeingEdited] = question;
        this.setState({scholarshipQuestions, isQuestionModalVisible: false});

        const newScholarship = {
            ...scholarship,
            extra_questions: arrayToDictionary(scholarshipQuestions)
        };
        updateScholarshipCurrentlyEditing(newScholarship)
    };

    addQuestion = () => {
        const { scholarshipQuestions } = this.state;
        scholarshipQuestions.push({});

        const indexBeingEdited = scholarshipQuestions.length-1;
        const questionBeingEdited = scholarshipQuestions[indexBeingEdited];

        this.setState({
            scholarshipQuestions,
            questionBeingEdited,
            indexBeingEdited,
            isQuestionModalVisible: true
        });

    };

    removeQuestion = (index) => {
        const { scholarshipQuestions } = this.state;
        const { updateScholarshipCurrentlyEditing, scholarship } = this.props;

        scholarshipQuestions.splice(index, 1);
        this.setState({scholarshipQuestions});

        const newScholarship = {
            ...scholarship,
            extra_questions: arrayToDictionary(scholarshipQuestions)
        };
        updateScholarshipCurrentlyEditing(newScholarship)
    };

    render() {

        const { scholarshipQuestions, questionBeingEdited, isQuestionModalVisible } = this.state;

        const columns = [
            {
                title: 'Key',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Label',
                dataIndex: 'label',
                key: 'label',
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: 'Web Form Selector',
                dataIndex: 'web_form_selector',
                key: 'web_form_selector',
            },
            {
                title: 'Modify',
                key: 'action',
                render: (text, record, index) => (
                    <React.Fragment>
                        <Button type="link"
                                onClick={()=>{
                                    this.editQuestion(index);
                                }}>
                            Edit
                        </Button> | <Button type="link"
                                onClick={()=>{
                                    this.removeQuestion(index);
                                }}>
                            Remove
                        </Button>
                    </React.Fragment>
                ),
            },
        ];
        return (
            <React.Fragment>
                {questionBeingEdited &&
                <ScholarshipQuestionAddEditModal visible={isQuestionModalVisible}
                                                 question={questionBeingEdited}
                                                 updateQuestion={this.updateQuestion} />}

            <Table columns={columns} dataSource={scholarshipQuestions} rowKey="id" />

                <Button type="primary"
                        icon="plus"
                        onClick={()=>{
                            this.addQuestion();
                        }}>
                    Add Question
                </Button>
            </React.Fragment>

        );

    }
}

const mapDispatchToProps = {
    updateScholarshipCurrentlyEditing,
};

const mapStateToProps = state => {
    return {
        scholarship: state.data.scholarship.scholarshipCurrentlyEditing,
    };
};

ScholarshipAutomationBuilder.defaultProps = {
    // redux
    scholarship: null,
};

ScholarshipAutomationBuilder.propTypes = {
    // redux
    scholarship: PropTypes.shape({}),
    updateScholarshipCurrentlyEditing: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ScholarshipAutomationBuilder);