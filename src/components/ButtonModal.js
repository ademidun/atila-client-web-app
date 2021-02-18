import React from 'react';

import { Button, Modal } from "antd";


class ButtonModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalVisible: false,
        }
    }

    showModal = () => {
        this.setState({isModalVisible: true});
    };

    handleModalCancel = () => {
        this.setState({isModalVisible: false});
    };

    render() {
        const { buttonSize, buttonText, modalTitle, modalBody, submitText, onSubmit } = this.props;
        const { isModalVisible } = this.state;

        return(
            <div>
                <Button type="primary" size={buttonSize} onClick={this.showModal}>
                    {buttonText}
                </Button>
                <Modal
                    title={modalTitle}
                    visible={isModalVisible}
                    onCancel={this.handleModalCancel}
                    footer={[
                        <Button key="back" onClick={this.handleModalCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={onSubmit}>
                            {submitText}
                        </Button>,
                    ]}
                >
                    {modalBody}
                </Modal>
            </div>
        )
    }
}

export default ButtonModal;
