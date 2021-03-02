import React from "react";

function InformationWithImage({item}) {


    return (
        <div>
            <div className="p-3">
                <h2>{item.title}</h2>
                {item.body}
            </div>
            {item.image &&

            <div className="col-12 mb-4 shadow text-center">

                {/*Note: TO get the image to size responsively.
                    I just had to put it inside a parent div and add 'col-12' class.*/}
                <img src={item.image}
                    alt={item.title}
                    title={item.title}
                    className="col-12 p-3"
                    style={{maxHeight: "450px", width: "auto"}}
                />
                {item.imageCaption &&
                <p className="col-12 text-center text-muted pb-3">
                    {item.imageCaption}
                </p>
                }
            </div>
            }
        </div>

    )
}

export default InformationWithImage