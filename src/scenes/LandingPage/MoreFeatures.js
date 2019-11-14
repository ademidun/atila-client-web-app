import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import viewEssaysGif from './assets/view-essays.gif';
import emailDigest1 from './assets/digest-email-screenshot-1.png';
import emailDigest2 from './assets/digest-email-screenshot-2.png';
import emailScholarshipDue from './assets/scholarship-due-email.png';
import './MoreFeatures.scss';
function MoreFeatures({title}) {

    return (
        <div  className="MoreFeatures container">
            {title}
            {title &&
            <h2  className="col-sm-12 text-center">
                Stay Woke.{' '}
                <Link to="essay">
                    Read Essays.
                </Link>
            </h2>
            }

            <div className="offset-lg-1">
                <div  className="row">
                    <div  className="card shadow m-3 p-5 col-lg-4 col-sm-12">
                        <h3 >1. Get Notified when Scholarships are Due
                            <span role="img" aria-label="clock emoji">
                                🕐
                            </span>
                        </h3>
                        <p >Save scholarships you're interested in and we'll let you know 7 days and 24 hours before the scholarship is due.</p>
                    </div>
                    <div  className="card shadow m-3 p-3 col-lg-7 col-sm-12">
                        <img  alt="Get Notified when Scholarships are Due"
                              className="landing-page-gif landing-page-gif-mobile" id="scholarship-notifications-gif"
                              src={emailScholarshipDue} title="Get Notified when Scholarships are Due" />
                    </div>

                </div>
                <div  className="row">
                    <div  className="card shadow m-3 p-5 col-lg-4 col-sm-12">
                        <h3>
                            2. Get Notified BEFORE Scholarships are Due
                            <span role="img" aria-label="clock emoji">
                                🕐
                            </span>
                        </h3>
                        <p >Weekly scholarship reminders for scholarships customized just for you</p>
                    </div>
                    <div  className="card shadow m-3 p-3 col-lg-7 col-sm-12">
                        <img  alt="Get Notified BEFORE Scholarships are Due"
                              className="landing-page-gif landing-page-gif-mobile"
                              src={emailDigest1} title="Get Notified when Scholarships are Due" />

                        <img  alt="Get Notified BEFORE Scholarships are Due"
                              className="landing-page-gif landing-page-gif-mobile"
                              src={emailDigest2} title="Get Notified when Scholarships are Due" />
                    </div>
                </div>
                <div  className="row">
                    <div  className="card shadow m-3 p-5 col-lg-4 col-sm-12">
                        <h3 >3. Read Other student's <Link to="essay">Essays</Link>
                            <span role="img" aria-label="people holding hands emoji">
                                👫
                            </span>
                        </h3>
                        <p >Read <Link to="essay">essays and past applications</Link> from other students for scholarships and schools you're interested in.</p>
                    </div>
                    <div  className="card shadow m-3 p-3 col-lg-7 col-sm-12">

                        <img  alt="Read Other student's Essays" className="landing-page-gif landing-page-gif-mobile" id="view-essays-gif" src={viewEssaysGif} title="Read Other student's Essays" />
                    </div>
                </div>
            </div>
        </div>
    );
}

MoreFeatures.defaultProps = {
    title: (<h1 className="col-sm-12 text-center">
                <Link to="/blog/atila/what-is-atila"> More Features </Link>
            </h1>)
};

MoreFeatures.propTypes = {
    title: PropTypes.shape({})
};
export default MoreFeatures;