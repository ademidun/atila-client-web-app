import React from "react";

const schoolImages = [
    {
        "url": "https://imgur.com/VXhmyOx.jpg",
        "alt": "University of Toronto",
        "width":"120",
        "height":"90",
    },
    {
        "url": "https://imgur.com/6kJAH06.jpg",
        "alt": "Ivey Business School",
        "width":"120",
        "height":"75",
    },
    {
        "url": "https://i.imgur.com/BSIjvEC.jpg",
        "alt": "McGill University",
        "width":"140",
        "height":"60",
    },
    {
        "url": "https://i.imgur.com/zOQZsdL.jpg",
        "alt": "University of British Columbia",
        "width":"150",
        "height":"75",
    },
    {
        "url": "https://i.imgur.com/XPjzuEl.jpg",
        "alt": "University of Alberta",
        "width":"155",
        "height":"50",
    },
    {
        "url": "https://i.imgur.com/eHdi4cu.jpg",
        "alt": "Simon Fraser University",
        "width":"175",
        "height":"80",
    },
    {
        "url": "https://i.imgur.com/aPk1hmk.jpg",
        "alt": "Humber College",
        "width":"110",
        "height":"65",
    },
    {
        "url": "https://i.imgur.com/YLUk42o.jpg",
        "alt": "Carleton University",
        "width":"120",
        "height":"70",
    },
    {
        "url": "https://i.imgur.com/erf5H8M.jpg",
        "alt": "Ryerson University",
        "width":"120",
        "height":"75",
    },
    {
        "url": "https://i.imgur.com/IWerHJh.jpg",
        "alt": "Dalhousie University",
        "width":"140",
        "height":"50",
    },
    {
        "url": "https://i.imgur.com/w2ztHKJ.png",
        "alt": "Langara College",
        "width":"140",
        "height":"150",
    },
    {
        "url": "https://i.imgur.com/Z4IkK8h.png",
        "alt": "Laurentian University",
        "width":"210",
        "height":"50",
    },
    {
        "url": "https://i.imgur.com/oJu53qu.jpg",
        "alt": "Toronto District School Board",
        "width":"130",
        "height":"100",
    },
    {
        "url": "https://i.imgur.com/MCacdYu.jpg",
        "alt": "Waterloo Region District School Board",
        "width":"180",
        "height":"85",
    },
    {
        "url": "https://i.imgur.com/CBbAmV0.jpg",
        "alt": "Durham District School Board",
        "width":"90",
        "height":"100",
    },
    {
        "url": "https://i.imgur.com/bwUy1WL.jpg",
        "alt": "Waterloo Catholic District School Board",
        "width":"170",
        "height":"105",
    },
    {
        "url": "https://i.imgur.com/XghA3ft.jpg",
        "alt": "Halton District School Board",
        "width":"100",
        "height":"85",
    },

]

export function SocialProof() {
    return (
        <div className="container w-150 text-center">
            <div className="shadow p-3">
                <h3 className="col-sm-12 text-center">
                    Used by over 1,000 students across Canada at universities, colleges, and high schools
                    such as...
                </h3>
                <div>
                    {schoolImages.map (schoolImage => (
                    <img src={schoolImage.url} width={schoolImage.width} height={schoolImage.height} alt={schoolImage.alt} key={schoolImage.url}/>
                    ))}
                </div>
            </div>
        </div>
        )
}
