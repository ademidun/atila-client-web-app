import React from "react";

function EbookLandingBanner() {
  return (
    <div className='container'>
      <h1 className='col-sm-12 text-center'>Coming Soon</h1>

      <div className='row'>
        <br />
        <div className='  col' style={{ textAlign: "center" }}>
          <br />
          <div style={{ paddingTop: "10%" }}>
            <h4>Author: ATILA</h4>
          </div>
          <div>
            <h1 style={{ fontSize: "40px" }}>
              We have an exciting book coming soon
            </h1>
          </div>
          <div style={{ textAlign: "center" }}>
            <p>Featuring what the best universities are for jobs</p>
          </div>
          <div style={{ left: "50%", top: "50%" }}>
            <button className='btn btn-primary' style={{ width: "100px" }}>
              Buy Now for $9.99
            </button>
          </div>
        </div>

        <div className='card shadow col'>
          <div style={{ display: "table-cell", position: "relative" }}>
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
