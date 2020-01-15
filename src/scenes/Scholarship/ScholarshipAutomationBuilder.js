import React from 'react';
import PropTypes from "prop-types";
import {Button, Table} from "antd";

class ScholarshipAutomationBuilder extends React.Component{

    constructor(props) {
        super(props);

        const { scholarship } = props;
        console.log({scholarship, props});
        this.state = {
            scholarshipQuestions: Object.values(scholarship.extra_questions)
        }
    }

    addQuestion = () => {
        const { scholarshipQuestions } = this.state;
        scholarshipQuestions.push({});

        this.setState({scholarshipQuestions});
    };

    removeQuestion = (index) => {
        const { scholarshipQuestions } = this.state;
        scholarshipQuestions.splice(index, 1);

        this.setState({scholarshipQuestions});
    };

    render() {

        const { scholarshipQuestions } = this.state;

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
                                    console.log({record});
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
ScholarshipAutomationBuilder.defaultProps = {};

ScholarshipAutomationBuilder.propTypes = {
    scholarship: PropTypes.shape({}).isRequired,
};

export default ScholarshipAutomationBuilder;