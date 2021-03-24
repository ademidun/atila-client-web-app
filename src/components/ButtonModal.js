import React from 'react';

import {Button, Modal, Popconfirm} from "antd";


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
        if (onShowModal) {
            onShowModal();
        }
    };

    handleModalCancel = () => {
        this.setState({isModalVisible: false});
    };

    onSubmit = (event) => {
        const { onSubmit } = this.props;
        this.handleModalCancel();
        if (onSubmit) {
            onSubmit(event);
        }
    }

    render() {
        const { showModalButtonSize, showModalButtonDanger, showModalButtonType, showModalText, modalTitle, modalBody, submitText,
             addPopConfirm, popConfirmText, disabled } = this.props;
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

        let footer = addPopConfirm ? modalFooterWithPopConfirm : modalFooter
        let showModalButtonTypeProp = "primary"
        if (showModalButtonType !== undefined) {
            showModalButtonTypeProp = showModalButtonType
        }

        return(
            <div>
                <Button
                    type={showModalButtonTypeProp}
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

export default ButtonModal;
