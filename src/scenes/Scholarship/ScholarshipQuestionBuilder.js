import React from 'react';
import PropTypes from 'prop-types';
import {FILTER_TYPES, SORT_TYPES} from "../../models/ConstantsForm";
import {prettifyKeys, transformFilterDisplay, myJoin} from "../../services/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import ScholarshipDeadlineWithTags from "../../components/ScholarshipDeadlineWithTags";
import {Button, Table} from "antd";

const defaultQuestion = {
    "question": "",
    "type": "",
    "html": <input/>
};
class ScholarshipQuestionBuilder extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            questions: [
                defaultQuestion,
            ],
            sortValue: 'relevance_new'
        }
    }

    addQuestion = () => {
        const { questions } = this.state;
        questions.push(defaultQuestion);
        this.setState({questions });
    };

    render() {
        const { questions } = this.state;

        const columns = [
            {
                title: 'question',
                dataIndex: 'html',
                key: 'question',
            },
            {
                title: 'type',
                dataIndex: 'type',
                key: 'type',
            },
        ];

        return (
            <div>
                <Table columns={columns} dataSource={questions} rowKey="id" />
                <hr/>
                <br/>

                <Button onClick={this.addQuestion}>
                    Add Question
                </Button>
            </div>
        );
    }
}

export default ScholarshipQuestionBuilder;