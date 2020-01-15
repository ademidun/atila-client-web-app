import React from 'react';
import PropTypes from "prop-types";
import {Table} from "antd";

class ScholarshipAutomationBuilder extends React.Component{
    render() {

        const dataSource = [
            {
                key: '1',
                name: 'Mike',
                age: 32,
                address: '10 Downing Street',
            },
            {
                key: '2',
                name: 'John',
                age: 42,
                address: '10 Downing Street',
            },
        ];

        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            },
        ];
        return (
            <Table columns={columns} dataSource={dataSource} rowKey="id" />
        );

    }
}
ScholarshipAutomationBuilder.defaultProps = {};

ScholarshipAutomationBuilder.propTypes = {
    scholarship: PropTypes.shape({}).isRequired,
};

export default ScholarshipAutomationBuilder;