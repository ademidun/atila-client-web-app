import React from "react";
import HelmetSeo from "../../components/HelmetSeo";

function EbookLandingBanner() {
  const seoContent = {
    title: 'Atila Schools and Jobs Report | The Best Canadian Universities for the Best Jobs',
    description: 'The best Canadian Universities for getting jobs at Goldman Sachs, Google, McKinsey, Pfizer and more.',
    image: 'https://i.imgur.com/pDvsRnZ.png',
    slug: '/schools'
  };

  return (
    <div className='container'>

      <HelmetSeo content={seoContent} />
      <h1 className='col-sm-12 text-center'>Atila Schools and Jobs Report</h1>

      <div className='row'>
        <br />
        <div className="col text-center">
          <br />
          <div>
            <h2 >
                The best Canadian Universities for getting jobs at Goldman Sachs, Google, McKinsey, Pfizer
                and more.
            </h2>
          </div>
          <div className="col text-center">
            <p>Coming Soon</p>
          </div>
          <div className="col text-center">
            <button className='btn btn-primary'>
              Buy Now for $29.99
            </button>
          </div>
        </div>

        <div className='card shadow col'>
          <div>
            <img
              src='https://i.imgur.com/EH9wKtQ.png'
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              alt='Book cover'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EbookLandingBanner;

/*

*/
