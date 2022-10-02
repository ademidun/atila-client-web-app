import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function AudioTimer(props) {
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        let interval = null;

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
    }, [duration])

    const formatTime = (time) => {
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

