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
        const seoContent = {
            ...defaultSeoContent,
            title: 'Book a Demo to learn more about Atila',
            description: 'Interested in starting a scholarship on Atila? Book a demo to speak with a member of the team and learn more about how the process of starting a scholarship on Atila Works.',
        };

        return (
            <div className="container mt-5">
                <HelmetSeo content={seoContent} />
                <div className="card shadow p-3">
                    <h1>Book a Demo</h1>
                    <h3 className="text-muted text-center">
                        Interested in starting a scholarship on Atila?<br/>
                        Book a demo to speak with a member of the team and learn more about how
                        the process of starting a scholarship on Atila Works.
                    </h3>

                    <h6 className="text-muted text-center">
                        Before the meeting, read the <Link to="/start">How to start a scholarhip on Atila</Link> page.
                    </h6>
                    
                    <div id="schedule_form">
                    <div 
                        className="calendly-inline-widget"
                        data-url="https://calendly.com/atilatech/meeting"
                        style={{ minWidth: '320px', height: '1250px' }} />
                    </div>
                </div>
            </div>
        );
    }
}

export default BookDemo;