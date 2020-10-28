import React from "react";
import { Upload, message, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import {FilesAPI} from "../../services/FilesAPI";
import PropTypes from "prop-types";

const { Dragger } = Upload;

class FileInput extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            imageUploadProgress: null
        }
    }
    // https://github.com/react-component/upload#customrequest
    handleFileUpload = ({file}) => {

        const {keyName, onChangeHandler} = this.props;

        const { uploadTask, uploadRef} = FilesAPI.uploadFile({file});

        uploadTask.on(FilesAPI.FIREBASE_STATE_CHANGED,  (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log({progress});

            this.setState({ imageUploadProgress: progress });
        }, (error) => {
            console.log({error});
            this.setState({ imageUploadProgress: null });
        },  () => {
            uploadRef.getDownloadURL().then(userFileUrl => {
                message.success(`${file.name} file uploaded successfully.`);
                console.log({userFileUrl});

                // The onChange Handler expects events in the format event.target.name and event.target.value
                const onUploadEvent = {
                    target : {
                        name: keyName,
                        value: userFileUrl,
                    }
                };

                onChangeHandler(onUploadEvent);
                this.setState({ imageUploadProgress: null });
            });
        });
    };

    render() {
        const { title, type } = this.props;
        const { imageUploadProgress } = this.state;

        const draggerProps = {
            name: "file",
            multiple: false,
            showUploadList: false,
            customRequest: this.handleFileUpload,
            onChange(info) {
                const { status } = info.file;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        if (type === "image") {
            draggerProps.accept = "image/*"
        }
        return (
            <div>
                <Dragger {...draggerProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag a file to this area to upload {title}</p>
                    <p className="ant-upload-hint">
                        You can also paste the {type} url in the text box below
                    </p>
                </Dragger>
                {imageUploadProgress &&
                <div className="progress-div mt-4">
                    <Progress
                        type="line"
                        strokeColor="#87d068"
                        percent={imageUploadProgress}
                    />
                </div>
                }
            </div>
        )
    }
}

export default FileInput;

FileInput.propTypes = {
    keyName: PropTypes.string,
    title: PropTypes.string.isRequired,
    onChangeHandler: PropTypes.func.isRequired,
};