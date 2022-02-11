import React, { useState } from 'react';


interface ImageGifPropTypes {
    imageUrl: string,
    gifUrl: string,
    title: string,
    defaultImageType: "gif" | "image",
};

ImageGif.defaultProps = {
    defaultImageType: "image"
};

export function ImageGif(props: ImageGifPropTypes) {

    const { gifUrl, imageUrl, title, defaultImageType } = props;
    const [activeImageType, setActiveImageType] = useState(defaultImageType);

    const toggleActiveImageType = () => {
        const nextImageType = activeImageType === "gif" ? "image" : "gif";
        setActiveImageType(nextImageType);
    }

    return (
        <div style={{border: "none"}} className="cursor-pointer text-center" onClick={toggleActiveImageType}>
            <img src={imageUrl} width="100%" alt={title} style={{display: activeImageType === "image" ? "block": "none"}}/>
            <img src={gifUrl} width="100%" alt={title} style={{display: activeImageType === "gif" ? "block": "none"}}/>
            {gifUrl && imageUrl && <label className="mt-2">Click to toggle between image and GIF demo</label>}
        </div>
    )
}