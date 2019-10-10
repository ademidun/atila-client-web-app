import React from 'react';
import { Row, Col } from 'antd';
import './Footer.scss';
import {Link} from "react-router-dom";
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

function Footer() {
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
                  <div>
                    <Link to="/profile/atilaeng">
                      Engineering
                    </Link>
                  </div>
                  <div>
                    <a href="https://tech.atila.ca"
                       target="_blank"
                       rel="noopener noreferrer"
                    >
                      Atila Tech
                    </a>
                  </div>
                  <div>
                    <Link to="/terms-conditions">
                      Terms and Conditions
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

export default Footer;
