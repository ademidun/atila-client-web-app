import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {Button} from "antd";
import {Link} from "react-router-dom";
import {getGreetingTime} from "../../services/utils";
import moneyFaceEmoji from './assets/moneyFaceEmoji.png';
import {connect} from "react-redux";

class BannerLoggedIn extends React.Component {

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
            <div className="home-page-wrapper logged-in" id="banner">
                <QueueAnim className={`${className} page justify-content-center`}
                           type="alpha" delay={150}>
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
