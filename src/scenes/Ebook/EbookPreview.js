import React from 'react';
import ImageGallery from 'react-image-gallery';


function EbookPreview () {

    const images = [
        {
            url: 'https://i.imgur.com/kkV3Cra.png',
        },
        {
            url: 'https://i.imgur.com/pLaJDbn.png',
        },
        {
            url: 'https://i.imgur.com/tubBv4w.png',
        },
        {
            url: 'https://i.imgur.com/po09bdf.png',
        },
        {
            url: 'https://i.imgur.com/VKwEAYC.png',
        },
        {
            url: 'https://i.imgur.com/EeHtEBd.png',
        },
        {
            url: 'https://i.imgur.com/9EdP2Jt.png',
        },
        {
            url: 'https://i.imgur.com/qCYu9rL.png',
        },
        {
            url: 'https://i.imgur.com/z1WJibU.png',
        },
        {
            url: 'https://i.imgur.com/nrFwWei.png',
        },
        {
            url: 'https://i.imgur.com/X4l5XGn.png',
        },
        {
            url: 'https://i.imgur.com/yLrt8Y4.png',
        },
        {
            url: 'https://i.imgur.com/CxMZCwk.png',
        },
        {
            url: 'https://i.imgur.com/pLaJDbn.png',
        },
    ];

    images.forEach(image => {
        image.original = image.url;
        image.thumbnail = image.url;
    });

    return (
        <div className="EbookPreview" id="inside">
            {/*lineHeight: '7.5vw' so title is not truncated when offset*/}
            <h1 className="text-center mt-3"
                style={{lineHeight: '11vw'}}>
                See Inside the Book
            </h1>
            <ImageGallery
                items={images}
                showPlayButton={false}
                additionalClass="container"
            />
        </div>
    );
}

export default EbookPreview