import React from 'react';
import PropTypes from 'prop-types';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import ScrollParallax from 'rc-scroll-anim/lib/ScrollParallax';
import BannerImage from './BannerImage';
import {Button} from "antd";
import {Link, withRouter} from "react-router-dom";
import AutoComplete from "../../components/AutoComplete";
import {MASTER_LIST_EVERYTHING_UNDERSCORE} from "../../models/ConstantsForm";
import {getGreetingTime, slugify} from "../../services/utils";
import moneyFaceEmoji from './assets/moneyFaceEmoji.png';
import {connect} from "react-redux";

const loop = {
    duration: 3000,
    yoyo: true,
    repeat: -1,
};

class BannerLoggedIn extends React.Component {

    constructor(props) {
        super(props);
    };

    render() {

        const timeOfDay = getGreetingTime();
        const greetingEmojiDict = {
            'morning': '🌅',
            'afternoon': '☀️',
            'evening': '🌇',
        };

        const { userProfile, className } = this.props;
        const { first_name } = userProfile;
        const  humanizedGreeting = `Good ${timeOfDay} ${first_name} ${greetingEmojiDict[timeOfDay]},`;
        return (
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
                <QueueAnim className={`${className} page justify-content-center`} type="alpha" delay={150}>
                    <QueueAnim
                        className="text-wrapper responsive-text"
                        key="text"
                        type="bottom"
                    >
                        <h1 key="h1" className="mt-sm-5">
                            {humanizedGreeting}
                        </h1>
                        <h2 key="h2">
                            See your Scholarships <br/>
                            <img src={moneyFaceEmoji}
                                 style={{height: '55px'}}
                                 alt="money face emoji"/>
                        </h2>
                        <h2>
                            <Link to="/scholarship">
                                <Button type="primary">
                                    View Scholarships
                                </Button>
                            </Link>
                        </h2>
                    </QueueAnim>
                    <div className="img-wrapper" key="image">
                        <ScrollParallax location="banner" component={BannerImage} animation={{ playScale: [1, 1.5], y: 80 }} />
                    </div>
                </QueueAnim>
            </div>
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
