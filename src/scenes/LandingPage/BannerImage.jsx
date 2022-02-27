import React, { useState, useEffect, useRef } from 'react';

import bannerImage from "./assets/landing-cover-default.png";
import bannerImageIndia from "./assets/landing-cover-india.png";
import bannerImageNigeria from "./assets/landing-cover-nigeria.png";
import "./BannerImage.scss";

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
  }, 5000)

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
