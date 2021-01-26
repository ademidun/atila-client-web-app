import React from 'react';
import PropTypes from 'prop-types';
import TweenOne from 'rc-tween-one';
import ScrollParallax from 'rc-scroll-anim/lib/ScrollParallax';
import bannerImage from "./assets/landing-cover-big-scholarship.png";
import {Button} from "antd";
import {Link} from "react-router-dom";
import {getGreetingTime} from "../../services/utils";
import {connect} from "react-redux";

const loop = {
    duration: 3000,
    yoyo: true,
    repeat: -1,
};

class BannerLoggedIn extends React.Component {

    render() {

        const timeOfDay = getGreetingTime();
        const greetingEmojiDict = {
            'Morning': '🌅',
            'Afternoon': '☀️',
            'Evening': '🌇',
        };

        const { userProfile, className } = this.props;
        const { first_name } = userProfile;
        const  humanizedGreeting = `Good ${timeOfDay} ${first_name} ${greetingEmojiDict[timeOfDay]},`;
        return (
            <React.Fragment>
                <div className="home-page-wrapper banner-wrapper logged-in" id="banner">
        <div className="banner-bg-wrapper">
          <svg width="400px" height="576px" viewBox="0 0 400 576" fill="none">
            <TweenOne component="g" animation={[{ opacity: 0, type: 'from' }, { ...loop, y: 15 }]}>
              <ellipse id="Oval-9-Copy-4" cx="100" cy="100" rx="6" ry="6" stroke="#2F54EB" strokeWidth="1.6" />
            </TweenOne>
            <TweenOne component="g" animation={[{ opacity: 0, type: 'from' }, { ...loop, y: -15 }]}>
              <g transform="translate(200 400)">
                <g style={{ transformOrigin: '50% 50%', transform: 'rotate(-340deg)' }}>
                  <rect stroke="#FADB14" strokeWidth="1.6" width="9" height="9" />
                </g>
              </g>
            </TweenOne>
          </svg>
          <ScrollParallax location="banner" className="banner-bg" animation={{ playScale: [1, 1.5], rotate: 0 }} />
        </div>
        <div className={`${className} page row`}>
          <div
            className="col-lg-6 col-md-6 col-sm-12"
            key="text"
          >
            <h1 key="h1" className="mt-5">
                            {humanizedGreeting}
                        </h1>
                        <div className="mt-sm-3 text-center">
                            <Link to="/scholarship">
                                <Button type="primary">
                                    View Scholarships
                                </Button>
                            </Link>
                        </div>      
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 text-center" key="image">
            <img src={bannerImage}
                className="col-12" alt="Big cheque" />
        </div>
        </div>
      </div>
    
            <div className="home-page-wrapper banner-wrapper logged-in" id="banner">
                <div className="banner-bg-wrapper">
                    <svg width="400px" height="576px" viewBox="0 0 400 576" fill="none">
                        <TweenOne component="g" animation={[{ opacity: 0, type: 'from' }, { ...loop, y: 15 }]}>
                            <ellipse id="Oval-9-Copy-4" cx="100" cy="100" rx="6" ry="6" stroke="#2F54EB" strokeWidth="1.6" />
                        </TweenOne>
                        <TweenOne component="g" animation={[{ opacity: 0, type: 'from' }, { ...loop, y: -15 }]}>
                            <g transform="translate(200 400)">
                                <g style={{ transformOrigin: '50% 50%', transform: 'rotate(-340deg)' }}>
                                    <rect stroke="#FADB14" strokeWidth="1.6" width="9" height="9" />
                                </g>
                            </g>
                        </TweenOne>
                    </svg>
                    <ScrollParallax location="banner" className="banner-bg" animation={{ playScale: [1, 1.5], rotate: 0 }} />
                </div>
                </div>
            </React.Fragment>
        );
    }
}

BannerLoggedIn.defaultProps = {
    className: 'banner',
};
BannerLoggedIn.propTypes = {
    className: PropTypes.string,
    userProfile: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => {
    return { userProfile: state.data.user.loggedInUserProfile };
};
export default connect(mapStateToProps)(BannerLoggedIn);
