import React from 'react';
import PropTypes from 'prop-types';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import ScrollParallax from 'rc-scroll-anim/lib/ScrollParallax';
import BannerImage from './BannerImage';
import Button from "antd/es/button";
import {Link, withRouter} from "react-router-dom";

const loop = {
  duration: 3000,
  yoyo: true,
  repeat: -1,
};

class Banner extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      model: null,
      searchQuery: '',
    }
  };

  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: 'banner',
  };

  onSubmit = event => {
    event.preventDefault();
    const { searchQuery } = this.state;
    this.props.history.push(`/scholarship?q=${searchQuery}`);
  };

  updateSearch = event => {
    event.preventDefault();
    this.setState({searchQuery: event.target.value});
  };

  render() {
    const { className, isMobile } = this.props;
    const  { searchQuery } = this.state;

    return (
      <div className="home-page-wrapper banner-wrapper" id="banner">
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
        <QueueAnim className={`${className} page`} type="alpha" delay={150}>
          {isMobile && (
            <div className="img-wrapper" key="image">
              <BannerImage />
            </div>)}
          <QueueAnim
            className="text-wrapper"
            key="text"
            type="bottom"
          >
            <h1 key="h1">
              Atila
            </h1>
            <h2 key="h2">
              Increase your chances of getting more money for school {' '}
              <span role="img" aria-label="money emoji">
                🤑
              </span>
            </h2>
            <form className="col-sm-12 p-3 search-box"
                  onSubmit={this.onSubmit}>
              <div className="row justify-content-center preview-questions">

                <div className="search-box">

                  <div className="col-sm-12 input-field">
                    <label className="active" id="typeahead-label"
                           style={{ fontSize: '30px' }}
                    />
                    <input
                        className="form-control" id="typeahead-config"
                        type="text" tabIndex="0" placeholder="Enter a search term"
                        name="searchString"
                        onChange={this.updateSearch}/>
                  </div>
                  <div className="col-sm-12 pt-3">
                    <p>Sample Searches:{' '}
                      <Link to="/scholarship?q=engineering">
                        Engineering</Link>,{' '}
                      <Link to="/scholarship?q=female">
                        Female</Link>,{' '}
                      <Link to="/scholarship?q=ontario">
                        Ontario</Link>,{' '}
                      <Link to="/scholarship?q=toronto">
                        Toronto</Link>,{' '}
                      <Link to="/scholarship?q=black">
                        Black</Link> ,{' '}
                      <Link to="/scholarship?q=medical%20school">
                        Medical School</Link>{' '}
                    </p>
                  </div>

                </div>
              </div>
              <div className="" style={{ textAlign: 'center' }}>

                <Button type="primary"
                        className="center-block">
                  Find Scholarships
                </Button>
                  <Link to={`/scholarship?q=${searchQuery}`} className="text-white">
                    Get My Scholarships
                  </Link>
              </div>
            </form>
          </QueueAnim>
          {!isMobile && (
            <div className="img-wrapper" key="image">
              <ScrollParallax location="banner" component={BannerImage} animation={{ playScale: [1, 1.5], y: 80 }} />
            </div>)}
        </QueueAnim>
      </div>
    );
  }
}

export default withRouter(Banner);
