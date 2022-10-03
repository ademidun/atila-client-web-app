import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";


let interval: any = null;

function AudioTimer(props: any) {
    const [duration, setDuration] = useState(0);

    useEffect(() => {

        if (!props.stopped) {
          interval = setInterval(() => {
            setDuration((duration) => duration + 10);
          }, 10);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        }
    }, [duration, props.stopped])

    const formatTime = (time: number) => {
        return new Date(time).toISOString().slice(time > 1000 * 60 * 60 ? 11 : 14,22);
    }

    return (
        <div>
            <span>{formatTime(duration)}</span>
        </div>
    )
}

AudioTimer.propTypes = {
    stopped: PropTypes.bool
}

export default AudioTimer;

