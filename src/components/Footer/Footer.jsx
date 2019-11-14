import React from 'react';
import { Row, Col } from 'antd';
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
  faYoutube
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
              <Col md={6} sm={12} xs={12}>
                <div className="footer-center">
                  <div>
                    <Link to="/blog/atila/what-is-atila">
                      About
                    </Link>
                  </div>
                  <div>
                    <Link to="/team">
                      Team
                    </Link>
                  </div>
                  <div>
                    <Link to="/contact">
                      Contact
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
                </div>
              </Col>
              <Col md={6} sm={12} xs={12}>
                <div className="footer-center">
                  <Link to="/profile/atilaeng">
                    Engineering
                  </Link>
                  <div>
                    <a href="https://tech.atila.ca"
                       target="_blank"
                       rel="noopener noreferrer"
                    >
                      Atila Tech
                    </a>
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
                    <Link to="/blog">
                      Blogs
                    </Link>
                  </div>
                </div>
              </Col>
              <Col md={6} sm={12} xs={12}>
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
                </div>
              </Col>
              <Col md={6} sm={12} xs={12}>
                <div className="footer-center">
                  <div>
                    <a  target="_blank" rel="noopener noreferrer" href="https://www.divnkedin.com/company/atila-tech/">
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
                </div>
              </Col>
              <Col md={{ span: 6, offset: 3 }} sm={{ span: 12, offset: 6 }}>
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
