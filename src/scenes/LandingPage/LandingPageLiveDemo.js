import React from 'react';

function EmbedResponsiveYoutubeVideo({youtubeVideoId="4NPLmaar8is", title="How To Add A Scholarship To Atila", youtubeVideoUrl=''}) {

    if (youtubeVideoUrl) {
        /*var reGetId = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
        youtubeVideoId = youtubeVideoUrl.match(reGetId)[0];
        console.log(youtubeVideoId);*/

        youtubeVideoId = youtubeVideoUrl.split('v=')[1];
    }

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

export default EmbedResponsiveYoutubeVideo;