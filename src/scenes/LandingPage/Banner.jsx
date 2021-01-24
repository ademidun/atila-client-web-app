import React from 'react';
import PropTypes from 'prop-types';
import TweenOne from 'rc-tween-one';
import ScrollParallax from 'rc-scroll-anim/lib/ScrollParallax';
import {Button} from "antd";
import {Link, withRouter} from "react-router-dom";
import AutoComplete from "../../components/AutoComplete";
import {MASTER_LIST_EVERYTHING_UNDERSCORE} from "../../models/ConstantsForm";
import {slugify} from "../../services/utils";

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
    this.props.history.push(`/scholarship/s/${slugify(searchQuery)}`);
  };

  updateSearch = event => {
    event.preventDefault();
    event.persist();
    this.setState({searchQuery: event.target.value});

    if (event.key === 'Enter' || event.type === 'click') {
      // the only click event that can trigger updateSearch is when autocomplete item is selected
      this.props.history.push(`/scholarship/s/${slugify(event.target.value)}`);
    }

  };

  render() {
    const { className } = this.props;
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
        <div className={`${className} page row`}>
          <div
            className="col-lg-6 col-md-6 col-sm-12"
            key="text"
          >
            <h1 key="h1" className="mt-sm-5">
              Atila
            </h1>
            <h2 key="h2">

              The easiest way to <br/> start and get scholarships.
            </h2>
            <form className="col-sm-12"
                  onSubmit={this.onSubmit}
                  style={{ height: '300px'}}>
              <div className="row">
                <div className="col-sm-12 input-field">
                  <label className="active" id="typeahead-label"
                         style={{ fontSize: '30px' }}
                  />

                  <AutoComplete suggestions={MASTER_LIST_EVERYTHING_UNDERSCORE}
                                placeholder={"Search by school, city, program, ethnicity or more"}
                                onSelected={this.updateSearch}
                                value={searchQuery}
                                keyName={'searchString'}/>
                </div>
                <div className="col-sm-12">
                  <p className="mb-0">Sample Searches:{' '}
                    <Link to="/scholarship/s/engineering">
                      Engineering</Link>,{' '}
                    <Link to="/scholarship/s/female">
                      Female</Link>,{' '}
                    <Link to="/scholarship/s/ontario">
                      Ontario</Link>,{' '}
                    <Link to="/scholarship/s/toronto">
                      Toronto</Link>,{' '}
                    <Link to="/scholarship/s/black">
                      Black</Link> ,{' '}
                    <Link to="/scholarship/s/medical+school">
                      Medical School</Link>{' '},
                    <Link to="/scholarship/s/University+of+Western+Ontario">
                      University of Western Ontario</Link>
                  </p>
                </div>
                <Button type="primary"
                        className="center-block mb-3">
                  <Link to="/scholarship">
                    Find Scholarships
                  </Link>
                </Button>
                <Button type="primary"
                        className="center-block mb-3">
                  <Link to="/start">
                    Start a Scholarship
                  </Link>
                </Button>
              </div>
            </form>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 text-center" key="image">
            <img src="https://i.imgur.com/A78y2nQ.jpg"
                 className="col-12" alt="Big cheque" />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Banner);
