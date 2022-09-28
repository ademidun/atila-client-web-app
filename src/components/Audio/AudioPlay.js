import React from 'react';
import PropTypes from "prop-types";
import {AudioRecord} from "./AudioRecord";

export class AudioPlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            audioUrl: this.props.audioUrl
        }
    }

    render() {
        const { audioUrl } = this.state;

        return (
            <div>
                <audio controls src={ audioUrl } type='audio/mp3'/>
            </div>
        )
    }
}

AudioPlay.propTypes = {
    audioUrl: PropTypes.string
}