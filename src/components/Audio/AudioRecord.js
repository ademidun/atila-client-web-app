import React from "react";
import { Button, Spin } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { FilesAPI } from "../../services/FilesAPI";
import { AudioPlay } from "./AudioPlay";
import PropTypes from "prop-types";

export class AudioRecord extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            recorder: null,
            audioChunks: [],
            stream: null,
            uploadRef: null,
            audioPath: this.props.audioPath,
            audioUrl: this.props.value,
            recording: false,
            saving: false,
        }
    }

    startAudioRecording = async () => {
        try {
            this.setState({recording: true});

            if (!this.state.recorder) {
                let recorder = await this.getMediaRecorder();
                this.setState({
                    recorder: recorder
                })
            }

            this.state.recorder.start();
        } catch(err) {
            console.log("error starting recording: " + err);
            this.setState({recording: false});
        }
    }

    stopAudioRecording = () => {
        try {
            this.setState({saving: true});
            if (this.state.recorder) {
                this.state.recorder.addEventListener('stop', () => {
                    const audioBlob = new Blob(this.state.audioChunks, { type: 'audio/mp3'});
                    this.saveRecording(audioBlob);
                })

                this.state.stream.getTracks().forEach((track) => track.stop());
                this.state.recorder.stop();
            }
        } catch (err) {
            console.log("error stopping recording: " + err);
            this.setState({saving: false});
        } finally {
            this.setState({recording: false});
        }
    }

    saveRecording = (audioBlob) => {
        const { uploadTask, uploadRef} = FilesAPI.uploadFile(audioBlob, this.state.audioPath);
        uploadTask.on("state_changed", (snapshot) => {}, (error) => {
            console.log("audio uploading error: " + error);
        }, () => {
            uploadRef.getDownloadURL().then(url => {
                this.setState({audioUrl: url, saving: false});
                this.props.onAudioSaved({url: url});
            })
        })
    }

    getMediaRecorder = async () => {
        try {
            return new Promise(async resolve => {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.setState({stream});
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.addEventListener('dataavailable', event => {
                    this.setState({
                        audioChunks: [...this.state.audioChunks, event.data]
                    })
                })

                resolve(mediaRecorder);
            })
        } catch(err) {
            console.error("failed to record audio: ", err);
        }
    }

    deleteAudioRecording = () => {
        this.props.onAudioSaved({url: ''});
        this.setState({
            audioUrl: ''
        })
    }

    renderContent() {
        const {audioUrl, recording, saving} = this.state;

        if (audioUrl !== '') {
            return <div style={{display: 'flex', alignItems: 'center'}}>
                <AudioPlay audioUrl={this.state.audioUrl} />
                <Button onClick={this.deleteAudioRecording} className='ml-1 mb-2' type="primary" danger shape="circle" icon={<DeleteOutlined/>} />
            </div>;
        } else if (saving) {
            return <Spin />
        } else if (recording) {
            return <Button type="primary" onClick={this.stopAudioRecording}>Stop and save</Button>;
        } else {
            return <Button type="primary" className="mr-2" onClick={this.startAudioRecording}>Record an audio message</Button>;
        }
    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        )
    }
}

AudioRecord.propTypes = {
    audioPath: PropTypes.string,
    audioUrl: PropTypes.string,
    onAudioSaved: PropTypes.func,
}