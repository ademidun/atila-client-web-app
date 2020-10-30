import React from 'react';

function LandingPageLiveDemo({youtubeVideoId="MLnBK2ehXdQ", title="How To Add A Scholarship To Atila"}) {

    return (
        <div className="container center-block">
            <div className="videowrapper text-center">
                <iframe title={title}
                        src={`//www.youtube.com/embed/${youtubeVideoId}?cc_load_policy=1&cc_lang_pref=en`}
                        width="560" height="314" style={{maxWidth: '80%'}}>
                </iframe>
            </div>
        </div>
    );
}

export default LandingPageLiveDemo;