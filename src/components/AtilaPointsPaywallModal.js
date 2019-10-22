import React from "react";
import PropTypes from "prop-types";
import { Modal } from 'antd';
import $ from 'jquery';

class AtilaPointsPaywallModal extends React.Component {
    constructor(props) {
        super(props);

        const { pageViews } = props;
        this.state = {
            visible: false,
            pageViews,
        }
    }

    componentDidMount() {
        this.showModalUsingpageViews();
    }

    showModalUsingpageViews = () => {
        const { pageViews } = this.props;
        if (pageViews.count > 5) {
            $('#dimScreen').css('display', 'block');
            this.setState({visible: true});
        }
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
        $('#dimScreen').css('display', 'none');
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
        $('#dimScreen').css('display', 'none');
    };

    render() {
        return (
            <div>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        );
    }
}

AtilaPointsPaywallModal.propTypes = {
    pageViews: PropTypes.shape({}).isRequired,
};

export default AtilaPointsPaywallModal;