import React from 'react';

function YoutubeVideoEmbed() {

    return (
        <div className="container center-block">
            <h1 className="col-sm-12 text-center">
                    Atila Schools and Jobs Guide: Behind the Scenes
            </h1>
            <div className="videowrapper text-center">
                <iframe title="Atila Schools and Jobs Guide: Behind the Scenes"
                        src="//www.youtube.com/embed/9Wv_9a5SXR4?cc_load_policy=1"
                        width="560" height="314" style={{maxWidth: '80%'}}>
                </iframe>
            </div>
        </div>
    );
}

export default YoutubeVideoEmbed;