import React from 'react';
import PropTypes from 'prop-types';
import TweenOne from 'rc-tween-one';
import ScrollParallax from 'rc-scroll-anim/lib/ScrollParallax';
import {Button} from "antd";
import {Link, withRouter} from "react-router-dom";
import {slugify} from "../../services/utils";
import BannerImage from './BannerImage';

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

  onSearchSuggestionSelected = (event, { suggestion }) => {
    event.persist();
    event.preventDefault();

    this.setState({
      searchQuery: suggestion.query,
    });

    if (event.key === 'Enter' || event.type === 'click') {
      // the only click event that can trigger updateSearch is when autocomplete item is selected
      this.props.history.push(`/scholarship?query=${slugify(suggestion.query)}`);
    }
  };

  render() {
    const { className } = this.props;

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
        <div className={`${className} page row`}>
          <div
            className="col-lg-6 col-md-6 col-sm-12"
            key="text"
          >
            <h1 key="h1" className="mt-4">
              Atila
            </h1>
            <h2 key="h2">

              Connecting students <br/> 
              with mentorships and scholarships
            </h2>
            <form className="col-sm-12"
                  style={{ height: '300px'}}>
              <div className="row">
                <Button type="primary"
                        className="center-block mt-3">
                  <Link to="/mentorship">
                    Find Mentors
                  </Link>
                </Button>
                <Button type="primary"
                        className="center-block my-3">
                  <Link to="/scholarship">
                    Find Scholarships
                  </Link>
                </Button>
              </div>
            </form>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 text-center" key="image">
            <BannerImage />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Banner);
