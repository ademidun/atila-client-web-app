import React, { useState, useEffect, useRef } from 'react';

import bannerImage from "./assets/landing-cover-default.png";
import bannerImageIndia from "./assets/landing-cover-india.png";
import bannerImageNigeria from "./assets/landing-cover-nigeria.png";
import "./BannerImage.scss";

/**
 * See: https://overreacted.io/making-setinterval-declarative-with-react-hooks/#just-show-me-the-code
 * See: https://stackoverflow.com/a/53395342/5405197
 * @param {*} callback 
 * @param {*} delay 
 */
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default function BannerImage() {

  
  const images = [{
    src: bannerImage,
    label: "Big cheque",
  }, 
  {
    src: bannerImageIndia,
    label: "Big cheque Indian style",
  }, 
  {
    src: bannerImageNigeria,
    label: "Big cheque Nigerian style",
  },]
  ;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoopImages, setIsLoopImages] = useState(true)
  
  useInterval(()=> {
    if (isLoopImages) {
      setActiveImageIndex(prevImageIndex =>  prevImageIndex + 1);
    }
  }, activeImageIndex < images.length ? 1500 : 5000) // set interval on first loop to be 1.5 seconds instead of 5 seconds so user can see the other images before they scroll away

  const activeImage = images[activeImageIndex % images.length];
  return (
    <img src={activeImage.src}  
         className="BannerImage col-12" 
         alt={activeImage.label} 
         onClick={() => {
           setActiveImageIndex(prevImageIndex =>  prevImageIndex + 1);
           setIsLoopImages(false);
          }
          }
            />
  );
}
