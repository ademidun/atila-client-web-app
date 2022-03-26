import React from 'react';
import HelmetSeo, { defaultSeoContent } from '../../components/HelmetSeo';
import AtlasPayment from './AtlasPayment/AtlasPayment';

function Atlas() {

    const title = "Atila Atlas - A search engine built for crypto";
    const seoContent = {
        ...defaultSeoContent,
        title,
    }
  return (
    <div className="Crypto container card shadow mt-5 pt-5">
        <HelmetSeo content={seoContent} />
        <h1>Atlas</h1>
        <h3 className="text-center">A search engine built for crypto.</h3>

        <div className="m-3 text-center">
            <AtlasPayment />
        </div>
        
    </div>
  )
}

export default Atlas