import React from 'react';
import { Button } from "antd";
import "./Ebook.scss";
import {handleButtonClickEventFacebook} from "../../models/Utils";

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
            <br/>
            <Button className='buy-book-button center-block' style={{fontSize: 20}} type='primary'>
                <a
                    href='https://gum.co/BbFon'
                    target='_blank'
                    rel='noopener noreferrer'
                    name="AddToCart"
                    onClick={handleButtonClickEventFacebook}
                >
                  Interested in buying the book?
                </a>
              </Button>
        </div>
    );
}

export default YoutubeVideoEmbed;