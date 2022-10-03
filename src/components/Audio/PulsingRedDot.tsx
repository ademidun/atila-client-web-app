import React from 'react';
import './PulsingRedDot.scss';

const PulsingRedDot = () => {
    return <div className="Blink"
                style={{ backgroundColor: 'red', borderRadius: '50%', width: '15px', height: '15px'}} >
        <span> </span>
    </div>
}

export default PulsingRedDot;