import React from 'react';
import {Row, Col, Tag} from 'antd';
import './Footer.scss';
import {Link, withRouter} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faItunesNote,
  faLinkedin,
  faMedium,
  faSpotify,
  faTwitter,
  faYoutube,
  faReddit,
    faTiktok
} from "@fortawesome/free-brands-svg-icons";

const goBack = (event, history) => {
  event.preventDefault();
  history.goBack();
};

function Footer({location, history}) {

  const { pathname } = location;

  if(pathname === '/premium') {
    return (<div className="center-block" style={{ textAlign: 'center'}}>
      <hr />
      <button onClick={(event) => goBack(event, history)}
              className="btn-link btn-text">
        Go Back
      </button>to previous page <br/>
          Return to <Link to="/">atila.ca</Link> homepage <br/>
    </div>)
  }
  return (
      <React.Fragment>
        <hr />
        <footer id="footer">
          <div className="footer-wrap p-1">
            <Row>
              <Col md={6} sm={12} xs={24}>
                <div className="footer-center">
                  <div>
                    <Link to={`/demo`}>
                          Book a Demo{' '}
                      <Tag color="green">new</Tag>
                    </Link>
                  </div>
                  <div>
                    <Link to="/start">
                      Start a Scholarship
                    </Link>
                  </div>
                  <div>
                    <Link to="/apply">
                      Apply for a Scholarship
                    </Link>
                  </div>
                  <div>
                    <Link to="/high-school">
                      Advice for High School Students
                    </Link>
                  </div>
                  <div>
                    <Link to="/about">
                      About
                    </Link>
                  </div>
                  <div>
                    <Link to="/testimonials">
                      Testimonials
                    </Link>
                  </div>
                  <div>
                    <Link to="/team">
                      Team
                    </Link>
                  </div>
                  <div>
                    <Link to="/essay">
                      Essays
                    </Link>
                  </div>
                  <div>
                    <Link to="/blog">
                      Blogs
                    </Link>
                  </div>
                  <div>
                    <Link to="/search">
                      Search
                    </Link>
                  </div>
                  <div>
                    <Link to="/rankings">
                      Atila Points Rankings{' '}
                      <Tag color="green">new</Tag>
                    </Link>
                  </div>
                </div>
              </Col>
              <Col md={6} sm={12} xs={24}>
                <div className="footer-center">
                  <div>
                    <Link to="/schools">
                      The Best Canadian universities for Getting a Job
                    </Link>
                  </div>
                  <div>
                    <Link to="/finalists">
                      Finalists and Winners{' '}
                      <Tag color="green">new</Tag>
                    </Link>
                  </div>
                  <div>
                    <Link to="/contact">
                      Contact
                    </Link>
                  </div>
                  <div>
                    <Link to="/profile/atilaeng">
                      Engineering
                    </Link>
                  </div>
                  <div>
                    <Link to="/terms-and-conditions">
                      Terms and Conditions
                    </Link>
                  </div>
                  <div>
                    <Link to="/pricing">
                      Pricing
                    </Link>
                  </div>
                  <div>
                    <Link to="/sitemap">
                      SiteMap
                    </Link>
                  </div>
                  <div>
                    <Link to="/rubric">
                      Rubric
                    </Link>
                  </div>
                  <div>
                    <Link to="/values">
                      Atila's Values
                    </Link>
                  </div>
                </div>
              </Col>
              <Col md={6} sm={12} xs={24}>
                <div className="footer-center">
                  <div>
                    <a  target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/channel/UCG2iWiYgJYkjBl4EdYGI5mw/">
                      Youtube <FontAwesomeIcon icon={faYoutube} />
                    </a>
                  </div>
                  <div>
                    <a  target="_blank" rel="noopener noreferrer" href="https://open.spotify.com/show/0m74ZmCPgjvp5WGOMg3P9C">
                      Spotify <FontAwesomeIcon icon={faSpotify} />
                    </a>
                  </div>
                  <div>
                    <a  target="_blank" rel="noopener noreferrer" href="https://itunes.apple.com/ca/podcast/id1440531021">
                      Itunes <FontAwesomeIcon icon={faItunesNote} />
                    </a>
                  </div>
                  <div>
                    <a  target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/atilatech/">
                      Instagram <FontAwesomeIcon icon={faInstagram} />
                    </a>
                  </div>
                  <div>
                    <a  target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/@atila.tech">
                      TikTok <FontAwesomeIcon icon={faTiktok} />
                    </a>
                  </div>
                </div>
              </Col>
              <Col md={6} sm={12} xs={24}>
                <div className="footer-center">
                  <div>
                    <a  target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/atila-tech/">
                      Linkedin <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                  </div>
                  <div>
                    <a  target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/atilatech1/">
                      Facebook <FontAwesomeIcon icon={faFacebook} />
                    </a>
                  </div>
                  <div>
                    <a  target="_blank" rel="noopener noreferrer" href="https://medium.com/atila-tech">
                      Medium <FontAwesomeIcon icon={faMedium} />
                    </a>
                  </div>
                  <div>
                    <a  target="_blank" rel="noopener noreferrer" href="https://twitter.com/atilatech">
                      Twitter <FontAwesomeIcon icon={faTwitter} />
                    </a>
                  </div>
                  <div>
                    <a  target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/r/atila/">
                      Reddit <FontAwesomeIcon icon={faReddit} />
                    </a>
                  </div>
                </div>
              </Col>
              <Col md={{ span: 6, offset: 3 }} sm={{ span: 12, offset: 6 }} xs={{ span: 24 }}>
                <a  target="_blank"
                    rel="noopener noreferrer" href="https://www.instagram.com/atilatech/">
                  Follow @atilatech on Instagram <FontAwesomeIcon icon={faInstagram} />
                </a>
              </Col>
            </Row>
          </div>
          <Row className="bottom-bar">
            <Col md={4} sm={24} />
            <Col md={20} sm={24}>
              <span style={{ marginRight: 12, fontSize: 'larger' }}>
                Built with <span role="img" aria-label="heaart emoji">
                                ❤️
                            </span> <br />

                By {' '}
                <a href="https://tech.atila.ca"
                   target="_blank"
                   rel="noopener noreferrer">
                  Atila Tech
                </a>
              </span>
            </Col>
          </Row>
        </footer>
      </React.Fragment>
  );
}

export default withRouter(Footer);
