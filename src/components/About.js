import React from 'react';
import {DescriptionsWithScreenshotsList} from "../scenes/LandingPage/HowItWorks";
import HelmetSeo, {defaultSeoContent} from "./HelmetSeo";
import Team from "./Team/Team";
import ImageGallery from "react-image-gallery";



const aboutContent = [
    {
        title: "Inspired by a Problem",
        body: <React.Fragment>

            Atila was founded in 2018 by Tomiwa Ademidun in his second-last year at Western University when he realized that his program
            was the most expensive undergrad program in Canada and he would be graduating with over $65,000 in student loans.

        </React.Fragment>,
        image: "https://i.imgur.com/WjXcGym.png",
        imageCaption: "Picture of Tomiwa's student loans",
    },
    {
        title: "Solving the Problem for all Students",
        body: <React.Fragment>
            <div className="text-muted ml-3">
                "As the child of immigrants from a middle-class family,
                paying for university was a big challenge. My thinking was that if I'm having this problem, other students probably have this problem as well. <br/><br/>
                I did some research and this turned out to be true. At the time, the average student with student loans was graduating with $26,000 in debt.
                So I built something that would help me find scholarships and built it in such a way that other students could use it as well."
            </div>
            <span>
                - Tomiwa, Founder Atila
            </span>
        </React.Fragment>,
        image: "https://i.imgur.com/NjO3KUG.jpg",
        imageCaption: "Tomiwa on his first day of school (before the student loans)."

    },
    {
        title: "For Students by Students",
        body: <React.Fragment>
            Atila is supported by a team of students who want to help other students pay for their education and get financial freedom.
        </React.Fragment>,
        image: "https://i.imgur.com/2UiZp58.png"
    },
    {
        title: "We Do Other Stuff",
        body: <React.Fragment>
            In addition to helping students find scholarships, we also create lots of content to help students get the information they need for their
            education, career and life in general. Check us out on Twitter, Instagram and all Socials
            @atilatech (links at the bottom of this page).
        </React.Fragment>,
        image: "https://i.imgur.com/8cpI2uS.png"
    }
];


const images = [
    {
        url: 'https://i.imgur.com/PMg68If.png',
    },
    {
        url: 'https://i.imgur.com/9EMWl2H.jpg',
    },
    {
        url: 'https://i.imgur.com/9ENW8DO.jpg',
    },
    {
        url: 'https://i.imgur.com/orG2ojY.jpg',
    },
    {
        url: 'https://i.imgur.com/SGYwJfU.jpg',
    },
    {
        url: 'https://i.imgur.com/akspUR4.jpg',
    },
    {
        url: 'https://i.imgur.com/YHkb2iK.png',
    },
    {
        url: 'https://i.imgur.com/cCLCHJp.png',
    }
    ];

images.forEach(image => {
    image.original = image.url;
    image.thumbnail = image.url;
});

function About({showTeam= true}) {
    const seoContent = {
        ...defaultSeoContent,
        title: 'About Atila - Giving Students Financial Freedom'
    };
    return (

        <div className="container">
            <HelmetSeo content={seoContent}/>
            <h1 className="col-sm-12 text-center">
                About Atila: Our Story
            </h1>
            <h3 className="col-sm-12 text-center text-muted">
                Democratizing Financial Freedom for Education
            </h3>
            <div className="offset-lg-1">

                <DescriptionsWithScreenshotsList items={aboutContent} />

                <h1>Pictures of the Atila Team</h1>
                <ImageGallery
                    items={images}
                    showPlayButton={false}
                    additionalClass="container"
                />


                {showTeam && <Team showAbout={false} />}
            </div>
        </div>
    )
}

export default About;