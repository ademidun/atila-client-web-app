import React from "react";
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import {FilesAPI} from "../../services/FilesAPI";

const { Dragger } = Upload;


// https://github.com/react-component/upload#customrequest
export const handleFileUpload = ({file}) => {
    const { uploadTask, uploadRef} = FilesAPI.uploadFile({file});

    uploadTask.on(FilesAPI.FIREBASE_STATE_CHANGED,  (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log({progress});
    }, (error) => {
        console.log({error})
    },  () => {
        uploadRef.getDownloadURL().then(userFileUrl => {
            message.success(`${file.name} file uploaded successfully.`);
            console.log({userFileUrl})
        });
    });
};

function FileInput({title, keyName, onChangeHandler}) {

    const props = {
        name: 'file',
        multiple: false,
        customRequest: handleFileUpload,
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


    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload {title}</p>
            <p className="ant-upload-hint">
                You can also paste the image url in the text box below
            </p>
        </Dragger>
    )
}

export default FileInput;