import React from "react";

const schoolImages = [
    {
        "url": "https://imgur.com/VXhmyOx.jpg",
        "alt": "University of Toronto",
    },
    {
        "url": "https://imgur.com/6kJAH06.jpg",
        "alt": "Ivey Business School",
    }
]

export function SocialProof() {
    return (
        <div className="card w-150 text-center">
            <div className="shadow p-3">
                <h3 className="col-sm-12 text-center">
                    Used by over 1,000 students across Canada at universities, colleges, and high schools
                    such as...
                </h3>
                <div>
                    {schoolImages.map (schoolImage => (
                    <img src={schoolImage.url} width="150" height="auto" alt={schoolImage.alt}/>
                    ))}
                    <img src="https://imgur.com/BSIjvEC.jpg" width="170" height="70" alt="McGill University"></img>
                    <img src="https://imgur.com/zOQZsdL.jpg" width="150" height="75" alt="University of British Columbia"></img>
                    <img src="https://imgur.com/XPjzuEl.jpg" width="155" height="50" alt="University of Alberta"></img>
                    <img src="https://imgur.com/eHdi4cu.jpg" width="175" height="80" alt="Simon Fraser University"></img>
                    <img src="https://imgur.com/aPk1hmk.jpg" width="120" height="60" alt="Humber College"></img>
                    <img src="https://imgur.com/YLUk42o.jpg" width="120" height="70" alt="Carleton University"></img>
                    <img src="https://i.imgur.com/w2ztHKJ.png" width="150" height="auto" alt="Langara College"></img>
                </div>
                <div>
                    <img src="https://imgur.com/oJu53qu.jpg" width="150" height="120" alt="Toronto District School Board"></img>
                    <img src="https://imgur.com/MCacdYu.jpg" width="180" height="85"
                         alt="Waterloo Region District School Board"></img>
                    <img src="https://imgur.com/CBbAmV0.jpg" width="120" height="130" alt="Durham District School Board"></img>
                    <img src="https://imgur.com/bwUy1WL.jpg" width="190" height="120"
                         alt="Waterloo Catholic District School Board"></img>
                    <img src="https://imgur.com/XghA3ft.jpg" width="130" height="120"
                         alt="Halton District School Board"></img>
                </div>
            </div>
        </div>
        )
}
