import { Button } from 'antd';
import React from 'react';
import {Link} from "react-router-dom";
import HelmetSeo from './HelmetSeo';
import defaultSeoContent from './HelmetSeo';


class BookDemo extends React.Component {

    componentDidMount() {
        const head = document.querySelector('head');
        const script = document.createElement('script');
        script.setAttribute('src',  'https://assets.calendly.com/assets/external/widget.js');
        head.appendChild(script);
    }

    render() {
        const title = "Try or Book a Demo";
        const description = "Try the Atila demo for yourself or book a meeting to speak with a member of the Atila team.";
        const seoContent = {
            ...defaultSeoContent,
            title: `${title} to learn more about Atila`,
            description: `Interested in starting a scholarship on Atila? ${description}`,
        };

        return (
            <div className="container mt-5">
                <HelmetSeo content={seoContent} />
                <div className="card shadow p-3">
                    <h1>{title}</h1>
                    <h3 className="text-center">
                        {description}
                    </h3>
                    <hr/>
                    <Button type="primary" className="pt-2" style={{height: "auto"}}>
                        <a href="https://demo.atila.ca" target="_blank" rel="noopener noreferrer">
                            <h3 className="text-white" style={{fontFamily: "initial"}}>
                                Try Atila demo <br/> at demo.atila.ca
                            </h3>
                        </a>
                    </Button>
                    
                    <hr/>
                    <h1>Book a meeting with the Atila team</h1>

                    <h4 className="text-center">
                        Before the meeting, read the <Link to="/start">How to start a scholarhip on Atila</Link> page.
                    </h4>
                    <div id="schedule_form">
                    <div 
                        className="calendly-inline-widget"
                        data-url="https://calendly.com/tomiwa1a/meeting"
                        style={{ minWidth: '320px', height: '1250px' }} />
                    </div>
                </div>
            </div>
        );
    }
}

export default BookDemo;