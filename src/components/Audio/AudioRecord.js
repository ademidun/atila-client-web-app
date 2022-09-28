import React from "react";
import { Button } from "antd";
import { FilesAPI } from "../../services/FilesAPI";
import { AudioPlay } from "./AudioPlay";

export class AudioRecord extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            recorder: null,
            audioChunks: [],
            stream: null,
            audioPath: this.props.audioPath,
            audioUrl: this.props.value,
            uploadRef: null,
            recording: false,
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
                this.setState({audioUrl: url});
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

    renderContent() {
        const {audioUrl, recording} = this.state;

        if (audioUrl !== '') {
            return <AudioPlay audioUrl={this.state.audioUrl} />;
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