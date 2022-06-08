import React from "react";
import PropTypes from "prop-types";
import {Table} from "antd";

class ViewApplicationsTable extends  React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { applications } = this.props;

        if (applications.length === 0) {
            return (
                <>
                    No applications
                </>
            )
        }


        let scholarshipResponses = applications.map(application => application.scholarship_responses)
        let scholarshipKeyToResponses = scholarshipResponses.map(questionDict => {
            let newDict = {}
            for (let [questionKey, questionInfo] of Object.entries(questionDict)) {
                newDict[questionKey] = questionInfo.response
            }
            return newDict
        })

        let columns = []
        // Get columns from first entry
        let counter = 1
        for (let [questionKey, questionInfo] of Object.entries(scholarshipResponses[0])) {
            const question = questionInfo.question

            columns.push({
                title: <b>{question}</b>,
                dataIndex: questionKey,
                key: counter,
                render: (response) => {
                    return <div dangerouslySetInnerHTML={{__html: response}} />
                }
            })
            counter += 1
        }


        console.log(JSON.stringify(scholarshipKeyToResponses))
        console.log(columns)

        return (
            <div>
                <Table columns={columns} dataSource={scholarshipKeyToResponses} />
            </div>
        );
    }
}

ViewApplicationsTable.propTypes = {
    applications: PropTypes.array,
    scholarship: PropTypes.shape({}),
};

export default ViewApplicationsTable
