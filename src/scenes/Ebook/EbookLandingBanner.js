import React from "react";

function EbookLandingBanner() {

  return (
    <div className='container'>
      <h1 className='col-sm-12 text-center my-5'>Atila Schools and Jobs Report</h1>

      <div className='row my-5'>
        <br />
        <div className="col text-center">
          <br />
            <h2 >
                The best Canadian Universities for getting jobs at Goldman Sachs, Google, McKinsey, Pfizer
                and more.
            </h2>
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
              src="https://i.imgur.com/AM0KTy9.png"
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
