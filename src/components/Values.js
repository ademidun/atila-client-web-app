import React from "react";
import { BackTop} from "antd";
import HelmetSeo from "./HelmetSeo";

export const informationItems = [
    {
        title: "What Matters Most to Us",
        body: (<div>
            <ol>
                <li><strong>Empathy</strong>: Treat people how they want to be treated and always try to do what’s in their best interest. The golden rule and the silver rule are great starts but it’s not enough. Sometimes what you want may not always be what other people want so it’s important to see things from others perspectives and try to do them.</li><br/>
                <li><strong>Bet on People</strong>: As much as possible we try to give both our users and the Atila teams as much freedom as possible.</li><br/>
                <ol>
                    <li>For example, we give the scholarship money directly to the students, because we believe that most students know the best use of their funds to further their education and they should have the freedom to make that choice.</li><br/>
                    <li>For most of our scholarships we don’t enforce a word count because we want people to feel free to express themselves in as few or as many words as possible.</li><br/>
                </ol>
                <li><strong>Honesty</strong>: We believe that everyone’s goals can be achieved when everyone is candid and honest about what they want. This also means creating a safe space, where people are free to express their opinions but people are also safe to have their opinions challenged in a tactful, thoughtful and kind way.</li><br/>
                <li><strong>Transparency</strong>: We think that people make better decisions when they have better information. One of the best ways to get information is by being transparent we always try to be as transparent as possible.</li>
            </ol>
        </div>),
        image: "",
        imageCaption: "",
    },

];

class Values extends React.Component {

    render() {
        const seoDescription = "Here are some of the values we care about the most.";
        const seoContent = {
            title: "Atila's Values",
            description: seoDescription,
            image: "https://i.imgur.com/GeVZdus.png",
            slug: "/values"
        };

        return (
            <div className="Values">
                <HelmetSeo content={seoContent} />
                <h1 className="col-sm-12 text-center">
                    Atila's Values
                </h1>
                <BackTop/>
                <div className="container mt-5">
                    <div className="card shadow p-3">
                        {informationItems.map(item => (
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
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Values;
