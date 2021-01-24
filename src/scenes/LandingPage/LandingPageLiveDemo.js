import React from 'react';

function LandingPageLiveDemo({youtubeVideoId="4NPLmaar8is", title="How To Add A Scholarship To Atila"}) {

    return (
        <div className="embed-responsive  embed-responsive-16by9 my-3">
            <iframe title={title}
                    allowFullScreen
                    src={`//www.youtube.com/embed/${youtubeVideoId}?cc_load_policy=1&cc_lang_pref=en`}
                    className="embed-responsive-item">
            </iframe>
        </div>
    );
}

export default LandingPageLiveDemo;