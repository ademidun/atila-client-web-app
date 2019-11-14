import React from 'react';

function LandingPageLiveDemo() {

    return (
        <div className="container center-block">
            <h1 className="col-sm-12 text-center">
                <a href="https://www.youtube.com/watch?v=c_K4342WMwQ"
                   target="_blank"
                   rel="noopener noreferrer">
                Live Demo
                </a>
            </h1>
            <div className="videowrapper text-center">
                <iframe title="Atila Live demo Video"
                        src="//www.youtube.com/embed/c_K4342WMwQ?cc_load_policy=1"
                        width="560" height="314" style={{maxWidth: '80%'}}>
                </iframe>
            </div>
        </div>
    );
}

export default LandingPageLiveDemo;