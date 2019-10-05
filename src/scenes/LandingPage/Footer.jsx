import React from 'react';
import {FormattedMessage, IntlProvider} from 'react-intl';
import { Row, Col } from 'antd';
import './Footer.scss';
import cnLocale from "./zh-CN";

function Footer() {
  return (
      <IntlProvider locale={cnLocale.locale} messages={cnLocale.messages}>
        <footer id="footer">
          <div className="footer-wrap">
            <Row>
              <Col md={6} sm={24} xs={24}>
                <div className="footer-center">
                  <h2>Ant Design</h2>
                  <div>
                    <a target="_blank " href="https://github.com/ant-design/ant-design">
                      GitHub
                    </a>
                  </div>
                  <div>
                    <a href="http://pro.ant.design">Ant Design Pro</a>
                  </div>
                  <div>
                    <a href="http://mobile.ant.design">Ant Design Mobile</a>
                  </div>
                  <div>
                    <a href="http://ng.ant.design">NG-ZORRO</a>
                    <span> - </span>
                    Ant Design of Angular
                  </div>
                  <div>
                    <a target="_blank " href="https://github.com/websemantics/awesome-ant-design">
                      <FormattedMessage id="app.footer.awesome" />
                    </a>
                  </div>
                  <div>
                    <a target="_blank " href="http://ant-design.gitee.io/">
                      <FormattedMessage id="app.footer.chinamirror" />
                    </a>
                  </div>
                </div>
              </Col>
              <Col md={6} sm={24} xs={24}>
                <div className="footer-center">
                  <h2><FormattedMessage id="app.footer.resources" /></h2>
                  <div>
                    <a href="http://scaffold.ant.design">Scaffolds</a>
                    <span> - </span>
                    <FormattedMessage id="app.footer.scaffolds" />
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/dvajs/dva">dva</a> - <FormattedMessage id="app.footer.dva" />
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/dvajs/dva-cli">dva-cli</a> -
                    <FormattedMessage id="app.footer.dev-tools" />
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="http://motion.ant.design">Ant Motion</a>
                    <span> - </span>
                    <FormattedMessage id="app.footer.motion" />
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="http://library.ant.design/">AntD Library</a>
                    <span> - </span>
                    <FormattedMessage id="app.footer.antd-library" />
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="http://ux.ant.design">Ant UX</a>
                    <span> - </span>
                    <FormattedMessage id="app.footer.antux" />
                  </div>
                </div>
              </Col>
              <Col md={6} sm={24} xs={24}>
                <div className="footer-center">
                  <h2><FormattedMessage id="app.footer.community" /></h2>
                  <div>
                    <a href="/changelog">
                      <FormattedMessage id="app.footer.change-log" />
                    </a>
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/ant-design/ant-design/wiki/FAQ">
                      <FormattedMessage id="app.footer.faq" />
                    </a>
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="https://gitter.im/ant-design/ant-design">
                      <FormattedMessage id="app.footer.discuss-cn" />
                    </a>
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="https://gitter.im/ant-design/ant-design-english">
                      <FormattedMessage id="app.footer.discuss-en" />
                    </a>
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="http://new-issue.ant.design/">
                      <FormattedMessage id="app.footer.bug-report" />
                    </a>
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/ant-design/ant-design/issues">
                      <FormattedMessage id="app.footer.issues" />
                    </a>
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="http://stackoverflow.com/questions/tagged/antd">
                      <FormattedMessage id="app.footer.stackoverflow" />
                    </a>
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="https://segmentfault.com/t/antd">
                      <FormattedMessage id="app.footer.segmentfault" />
                    </a>
                  </div>
                </div>
              </Col>
              <Col md={6} sm={24} xs={24}>
                <div className="footer-center">
                  <h2>
                    <img className="title-icon" src="https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg" alt="" />
                    <FormattedMessage id="app.footer.more-product" />
                  </h2>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="https://antv.alipay.com/">AntV</a>
                    <span> - </span>
                    <FormattedMessage id="app.footer.data-vis" />
                  </div>
                  <div>
                    <a target="_blank" rel="noopener noreferrer" href="https://eggjs.org/">Egg</a>
                    <span> - </span>
                    <FormattedMessage id="app.footer.eggjs" />
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
                            </span> By {' '}
                <a href="https://tech.atila.ca"
                   target="_blank"
                   rel="noopener noreferrer">
                  Atila Tech
                </a>
              </span>
            </Col>
          </Row>
        </footer>
      </IntlProvider>
  );
}

export default Footer;
