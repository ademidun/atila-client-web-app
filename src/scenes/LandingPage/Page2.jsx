import React from 'react';
import { Row, Col, Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';

import svgBgToParallax from './util';
import {Link} from "react-router-dom";

const page2Data = [
  {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/eYNnmGagLWdrkdMHVUuA.svg',
    name: 'Ant Design Components',
  },
  {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/EPaPtDVGnJhyqyBAUZMl.svg',
    name: 'Scholarships Matched to Your Profile',
      slogan: (<p>
          Find customized scholarships based on your gender, ethnicity, school, program and more.
      </p>),
  },
  {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/GobRAKexhfTSJdLFzDFY.svg',
    name: "We'll notify you of new ones",
      slogan: (<p>When a new scholarship you qualify for opens up, we'll let you know</p>),
  },
  {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/slVtnOCcgeAcLEPwtewY.svg',
    name: 'Suggest Similar Scholarships',
      slogan: (<p>Applied to a scholarship in the past? We'll recommend similar scholarships</p>),
  },
];

const svgBgChild = [
  (
    <svg width="100%" height="100%" viewBox="0 0 1401 1109" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" preserveAspectRatio="xMidYMid slice" >
      <g transform="translate(-79.000000, -21.000000)">
        <circle id="Oval-13" stroke="none" fill="#EBEDF0" fillRule="evenodd" cx="98.5" cy="98.5" r="98.5" />
        <rect id="Rectangle-33" stroke="none" fill="#EBEDF0" fillRule="evenodd" transform="translate(1261.132034, 1217.132034) rotate(45.000000) translate(-1261.132034, -1217.132034) " x="1111.13203" y="1007.13203" width="300" height="300" rx="1" />
        <circle id="Oval-13" stroke="#EBEDF0" strokeWidth="16" fill="none" cx="1402" cy="151" r="70" />
        <path d="M385.032144,960.394832 L394.316344,976.475539 C394.868629,977.432124 394.540879,978.655305 393.584293,979.20759 C393.280255,979.383126 392.935367,979.475539 392.584293,979.475539 L374.015893,979.475539 C372.911323,979.475539 372.015893,978.580108 372.015893,977.475539 C372.015893,977.124466 372.108305,976.779577 372.283842,976.475539 L381.568042,960.394832 C382.120327,959.438247 383.343508,959.110497 384.300093,959.662781 C384.604131,959.838318 384.856607,960.090794 385.032144,960.394832 Z" id="Polygon-2" stroke="none" fill="#A3B1BF" fillRule="evenodd" transform="translate(383.300093, 970.709623) rotate(70.000000) translate(-383.300093, -970.709623) " />
        <path d="M545.537489,211.431472 L552.545207,223.569196 C553.097492,224.525781 552.769741,225.748962 551.813156,226.301246 C551.509118,226.476783 551.164229,226.569196 550.813156,226.569196 L536.79772,226.569196 C535.693151,226.569196 534.79772,225.673765 534.79772,224.569196 C534.79772,224.218122 534.890133,223.873234 535.06567,223.569196 L542.073387,211.431472 C542.625672,210.474887 543.848853,210.147137 544.805438,210.699421 C545.109477,210.874958 545.361952,211.127434 545.537489,211.431472 Z" id="Polygon-2" stroke="none" fill="#A3B1BF" fillRule="evenodd" transform="translate(543.805605, 218.500167) rotate(90.000000) translate(-543.805605, -218.500167) " />
        <g id="Group-26" transform="translate(146.000000, 338.000000)" fill="#FADB14">
          <image xlinkHref="https://gw.alipayobjects.com/zos/rmsportal/UtBesTOkoZsBUxPqfDlZ.svg" />
        </g>
      </g>
    </svg>
  ),
  (
    <svg width="1311px" height="920px" viewBox="0 0 1311 920" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Group-29" transform="translate(283.000000, 920.000000)" fill="#2F54EB">
        <image xlinkHref="https://gw.alipayobjects.com/zos/rmsportal/VrADJaRPMnFjmtmIhObV.svg" />
      </g>
      <circle id="Oval-8" stroke="#13C2C2" strokeWidth="4" opacity="0.95" cx="1096" cy="11" r="11" />
      <circle id="Oval-8" stroke="#13C2C2" strokeWidth="4" cx="11" cy="667" r="11" />
      <g id="Group-11" transform="translate(1207.000000, 419.000000)" fill="#13C2C2">
        <image xlinkHref="https://gw.alipayobjects.com/zos/rmsportal/MnLEmwjipfhzPUmBJnJE.svg" />
      </g>
      <g id="Group-28" transform="translate(884.000000, 821.000000)" fill="#2F54EB">
        <image xlinkHref="https://gw.alipayobjects.com/zos/rmsportal/dyNuxLOZtvjoHSVisbhQ.svg" />
      </g>
    </svg>
  ),
];

const svgBgChildArray = svgBgChild.map((item, i) => {
  const { props } = item;
  return React.cloneElement(item, { children: svgBgToParallax(props.children, i) });
});
export default function Page2({ isMobile }) {
  const componentButton = (
    <div key="b" className="components-button-wrapper">
      <Link to="/blog/atilaeng">Ant Design of React <Icon type="right" /></Link>
      <Link to="/blog/atilaeng">Ant Design of Angular <Icon type="right" /></Link>
    </div>
  );
  const children = page2Data.map((item, i) => {
    if (!isMobile && !i) {
      return null;
    }
    const content = isMobile && !i ? componentButton : [
        <span key={item.name}>{item.slogan}</span>,
        <Link to="/blog/atila/what-is-atila" key="a">
            learn more <Icon type="right" />
        </Link>,
    ];
    return (
      <Row className="product-block" key={i.toString()}>
        <Col
          xs={8}
          md={i === 2 ? 6 : 8}
          className={`block-image-wrapper${i % 2 ? ' right' : ''}`}
        >
          <img src={item.img} alt={item.name}
               style={isMobile && i === 2 ? { marginLeft: 16 } : {}} />
        </Col>
        <Col xs={16} md={i === 2 ? 18 : 16} className="block-text-wrapper">
          <h4>{item.name}</h4>
          {content}
        </Col>
      </Row>
    );
  });
  return (
    <div className="home-page-wrapper page2" id="page2">
      <div className="page mt-5" >
        <h2>
            How Does Atila Make it Easy to Find Scholarships?
        </h2>
          <QueueAnim
            component={Col}
            componentProps={{ xs: 24, md: 12 }}
            className="page2-components"
            key="left"
            type="bottom"
            leaveReverse
          >
            <h3 key="h1">Finding Scholarships Takes Too Long</h3>
            <div key="p">
                <ul>
                    <li>
                        Over 5 million scholarships are available in Canada every year.
                    </li>
                    <li>
                        But you only qualify for a small percentage of those scholarships.
                    </li>
                    <li>
                        Atila saves you time. By finding exactly the ones you qualify for.
                    </li>
                </ul>

            </div>
            {componentButton}
          </QueueAnim>
          <QueueAnim
              component={Col}
              componentProps={{ xs: 24, md: 12 }}
              className="page2-product"
              key="right"
              type="bottom"
              leaveReverse
          >
              <h4>With Atila</h4>
              <hr />
              {children}
          </QueueAnim>
      </div>
      <div className="parallax-bg bottom" >
        {svgBgChildArray[0]}
      </div>
      <div className="parallax-bg top" >
        {svgBgChildArray[1]}
      </div>
    </div>
  );
}
