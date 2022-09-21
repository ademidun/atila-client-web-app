import React from "react";
import { Button } from "antd";

export class UserProfileAudioMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recorder: null,
            stream: null,
            audioChunks: [],
        }
    }

    startAudioRecording = async () => {
        if (!this.state.recorder) {
            let recorder = await this.getMediaRecorder();
            this.setState({
                recorder: recorder
            })
        }

        this.state.recorder.start();
    }

    stopAudioRecording = () => {
        if (this.state.recorder) {
            this.state.recorder.addEventListener('stop', () => {
                const audioBlob = new Blob(this.state.audioChunks, { type: 'audio/mpeg'});
                const audioURL = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioURL);
                audio.play();
                // save audio to db
            })

            this.state.stream.getTracks().forEach((track) => track.stop());
            this.state.recorder.stop();
        }
    }

    getMediaRecorder = async () => {
        try {
            return new Promise(async resolve => {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.setState({ stream });
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



    render() {
        return (
            <div>
                <Button type="primary" className="mr-2" onClick={this.startAudioRecording}>Record an audio message</Button>
                <Button type="primary" onClick={this.stopAudioRecording}>Stop ad Replay</Button>
            </div>
        )
    }
}