import { Button } from 'antd';
import React from 'react';
import HelmetSeo, { defaultSeoContent } from '../../components/HelmetSeo';
import NotionPage from '../../components/Notion/NotionPage';
import AtlasAPIKeySignup from './AtlasAPIKeySignup';
import AtlasPayment from './AtlasPayment/AtlasPayment';

function Atlas() {

    const description = "A search engine for crypto and web3."
    const title = "Atila Atlas - A search engine built for crypto";
    const seoContent = {
        ...defaultSeoContent,
        description,
        title,
    }
  return (
    <div className="Crypto container">
      <div className="card shadow m-5 p-5">

      <HelmetSeo content={seoContent} />
        <h1>Atlas</h1>
        <h3 className="text-center">{description}</h3>

        <div className="m-3 text-center">
          <Button type="primary" size="large">
            <a href="https://chrome.google.com/webstore/detail/atila-atlas/lhjdnmdnomdgjkbefpnehflckklipbak" 
            target="_blank" 
            rel="noreferrer">
              Install Atlas
            </a>
            
          </Button>

          <p>
            Get 20 free credits by installing the Atlas browser extension or receiving it in your email.
          </p>
          
        </div>

        <h1>
          Get API Credits
        </h1>

        <div className="m-3 text-center">
            <AtlasAPIKeySignup />
        </div>

        <div className="m-3 text-center">
            <AtlasPayment />
        </div>
      </div>


        <div className="section card shadow m-5 p-5">
            <h1>
                What is Atlas?
            </h1>

            <NotionPage pageId="257f38221c3a4013946217c953bd3db9" showTableOfContents={false} className="p-2" />
        </div>
        
    </div>


  )
}

export default Atlas