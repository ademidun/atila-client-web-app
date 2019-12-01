import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {Button} from "antd";
import {Link, withRouter} from "react-router-dom";
import AutoComplete from "../../components/AutoComplete";
import {MASTER_LIST_EVERYTHING_UNDERSCORE} from "../../models/ConstantsForm";
import {slugify} from "../../services/utils";
import moneyFaceEmoji from './assets/moneyFaceEmoji.png';

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
        </div>
        <QueueAnim className={`${className} page justify-content-center`} type="alpha" delay={150}>
          <QueueAnim
            className="text-wrapper responsive-text"
            key="text"
            type="bottom"
          >
            <h1 key="h1" className="mt-sm-5">
              Atila
            </h1>
            <h2 key="h2">
              Get more money for school.<br/>
              Find and apply to scholarships. <br/>
              <img src={moneyFaceEmoji}
                   style={{height: '55px'}}
                   alt="money face emoji"/>
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
                        className="center-block my-3">
                  Find Scholarships
                </Button>
              </div>
            </form>
          </QueueAnim>
        </QueueAnim>
      </div>
    );
  }
}

export default withRouter(Banner);
