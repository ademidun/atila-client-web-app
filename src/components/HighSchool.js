import React from "react";
import HelmetSeo from "./HelmetSeo";
import {Link} from "react-router-dom";

function HighSchool() {

    const presentationDescription = 'This is a presentation for High school students' +
        ' about your life after high school: what are your options, ' +
        'how to learn what path is best for you and how can they achieve your goals.';
    const seoContent = {
        title: 'Life After High School',
        description: presentationDescription,
        image: 'https://i.ytimg.com/vi/bpyEWzblFrU/maxresdefault.jpg',
        slug: '/high-school'
    };

    return (
        <div className="container m-3">
            <HelmetSeo content={seoContent} />
            <div className="card p-3">
                <h1>Life After High School</h1>
                <div className="center-block mb-3 px-md-5">
                    {presentationDescription}
                </div>

                <div className="center-block mb-3">
                    Read <Link to="/blog/tomiwa/life-after-high-school">the full blog post</Link>
                </div>

                <div className="center-block mb-3">
                    <iframe src="https://www.youtube.com/embed/bpyEWzblFrU" width="720" height="405" frameBorder="0"
                            allowFullScreen="allowfullscreen" title="Life After High School Video" />
                </div>
                <div className="center-block mb-3">
                <iframe
                    src="https://docs.google.com/presentation/d/e/2PACX-1vScRK4W5LbjrkBx7HpX3aEgPharf90aVj3C7TkDYK3faGi2CO9_hBYl4bn26d2LiRyVaaamMOOqVbmQ/embed?start=false&amp;loop=false&amp;delayms=3000"
                    width="720" height="405" frameBorder="0" allowFullScreen="allowfullscreen" title="Life After High School Slide Deck" />
                </div>
                <div className="center-block mb-3">
                <div className="center-block mb-3">
                    Read <Link to="/blog/tomiwa/life-after-high-school">the full blog post</Link>
                </div>

                <iframe
                    src="https://atila.ca/blog/tomiwa/life-after-high-school"
                    width="720" height="405" frameBorder="0" allowFullScreen="allowfullscreen" title="Life After High School Blog Post" />
                </div>

            </div>
        </div>


    );
}

export default HighSchool;