import React from "react";

const schoolImages = [
    {
        "url": "https://imgur.com/VXhmyOx.jpg",
        "alt": "University of Toronto",
    },
    {
        "url": "https://imgur.com/6kJAH06.jpg",
        "alt": "Ivey Business School",
    },
    {
        "url": "https://i.imgur.com/BSIjvEC.jpg",
        "alt": "McGill University",
    },
    {
        "url": "https://i.imgur.com/zOQZsdL.jpg",
        "alt": "University of British Columbia",
    },
    {
        "url": "https://i.imgur.com/XPjzuEl.jpg",
        "alt": "University of Alberta",
    },
    {
        "url": "https://i.imgur.com/eHdi4cu.jpg",
        "alt": "Simon Fraser University",
    },
    {
        "url": "https://i.imgur.com/aPk1hmk.jpg",
        "alt": "Humber College",
    },
    {
        "url": "https://i.imgur.com/YLUk42o.jpg",
        "alt": "Carleton University",
    },
    {
        "url": "https://i.imgur.com/erf5H8M.jpg",
        "alt": "Ryerson University",
    },
    {
        "url": "https://i.imgur.com/IWerHJh.jpg",
        "alt": "Dalhousie University",
    },
    {
        "url": "https://i.imgur.com/w2ztHKJ.png",
        "alt": "Langara College",
    },
    {
        "url": "https://i.imgur.com/Z4IkK8h.png",
        "alt": "Laurentian University",
    },
    {
        "url": "https://i.imgur.com/oJu53qu.jpg",
        "alt": "Toronto District School Board",
    },
    {
        "url": "https://i.imgur.com/MCacdYu.jpg",
        "alt": "Waterloo Region District School Board",
    },
    {
        "url": "https://i.imgur.com/CBbAmV0.jpg",
        "alt": "Durham District School Board",
    },
    {
        "url": "https://i.imgur.com/bwUy1WL.jpg",
        "alt": "Waterloo Catholic District School Board",
    },
    {
        "url": "https://i.imgur.com/XghA3ft.jpg",
        "alt": "Halton District School Board",
    },
    {
        "url": "https://i.imgur.com/15trTBH.jpg",
        "alt": "Georgetown District School Board",
    },

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
                </div>
            </div>
        </div>
        )
}
