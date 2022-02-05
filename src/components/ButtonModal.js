import React from 'react';
import {Button, Modal, Popconfirm} from "antd";
import PropTypes from "prop-types";

class ButtonModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalVisible: false,
        }
    }

    showModal = () => {
        const { onShowModal } = this.props;
        this.setState({isModalVisible: true})

        onShowModal();
    };

    handleModalCancel = () => {
        this.setState({isModalVisible: false});
    };

    onSubmit = (event) => {
        const { onSubmit } = this.props;
        onSubmit(event);

        this.handleModalCancel();
    }

    render() {
        const { showModalButtonSize, showModalButtonDanger, showModalButtonType, showModalText, modalTitle, modalBody, submitText,
             addPopConfirm, popConfirmText, disabled, style, customFooter, className } = this.props;
        const { isModalVisible } = this.state;


        const modalFooter = [
            <Button key="back" onClick={this.handleModalCancel}>
                Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={this.onSubmit}>
                {submitText}
            </Button>,
        ]

        const modalFooterWithPopConfirm = [
            <Button key="back" onClick={this.handleModalCancel}>
                Cancel
            </Button>,
            <Popconfirm placement="topLeft" title={popConfirmText}
                        onConfirm={this.onSubmit}
                        okText="Yes"
                        cancelText="No">
                <Button key="submit" type="primary">
                    {submitText}
                </Button>
            </Popconfirm>
        ]

        let footer;

        if (customFooter !== undefined) {
            footer = customFooter
        } else if (addPopConfirm) {
            footer = modalFooterWithPopConfirm
        } else {
            footer = modalFooter
        }

        return(
            <div style={style} className={className}>
                <Button
                    type={showModalButtonType}
                    danger={showModalButtonDanger}
                    size={showModalButtonSize} onClick={this.showModal}
                    disabled={disabled}
                >
                    {showModalText}
                </Button>
                <Modal
                    title={modalTitle}
                    visible={isModalVisible}
                    onCancel={this.handleModalCancel}
                    footer={footer}
                >
                    {modalBody}
                </Modal>
            </div>
        )
    }
}

ButtonModal.defaultProps = {
    showModalButtonType: "primary",
    showModalButtonSize: "medium",
    showModalButtonDanger: false,
    showModalText: "Show Modal",
    modalTitle: "Modal Title",
    modalBody: "This is a modal",
    submitText: "Close Modal",
    addPopConfirm: false,
    popConfirmText: "",
    className: "",
    disabled: false,
    onShowModal: () => {},
    onSubmit: () => {},
}

ButtonModal.propTypes = {
    showModalButtonType: PropTypes.string,
    showModalButtonSize: PropTypes.string,
    showModalButtonDanger: PropTypes.bool,
    showModalText: PropTypes.string,
    modalTitle: PropTypes.string,
    modalBody: PropTypes.node,
    submitText: PropTypes.string,
    addPopConfirm: PropTypes.bool,
    popConfirmText: PropTypes.string,
    disabled: PropTypes.bool,
    onShowModal: PropTypes.func,
    onSubmit: PropTypes.func,
    style: PropTypes.shape({}),
    customFooter: PropTypes.node,
    className: PropTypes.string,
}

export default ButtonModal;
