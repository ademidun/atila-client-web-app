import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Row, Col } from 'antd';
import { Link } from "react-router-dom";
import moneyFaceEmoji from './assets/moneyFaceEmoji.png';
import relievedFaceEmoji from './assets/relievedFaceEmoji.png';
import magnifyingGlassEmoji from './assets/magnifyingGlassEmoji.png';

const atilaThreeThings = [
    {
        img: moneyFaceEmoji,
        name: 'Get more money for school',
    },
    {
        img: magnifyingGlassEmoji,
        name: 'Makes it easy to find scholarships',
    },
    {
        img: relievedFaceEmoji,
        name: 'Makes it Easy to apply for scholarships',
    },
];

export default class WhatIsAtila extends React.PureComponent {
  state = {
    hoverKey: null,
  };
  onMouseOver = (key) => {
    this.setState({
      hoverKey: key,
    });
  };
  onMouseOut = () => {
    this.setState({
      hoverKey: null,
    });
  };
  render() {
    const threeThingsChildren = atilaThreeThings.map((item) => {
      return (
        <Col key={item.name} md={8} xs={24}>
          <QueueAnim
            className="page1-block"
            type="bottom"
            component={Link}
            componentProps={{ to: item.to }}
            onMouseEnter={() => { this.onMouseOver(item.nameEn); }}
            onMouseLeave={this.onMouseOut}
          >
            <div className="page1-image font-size-40px">
                <img src={item.img}
                     style={{height: '55px'}}
                     alt={item.name}/>
            </div>
            <h3 >{item.name}</h3>
          </QueueAnim>
        </Col>
      );
    });
    return (
      <div className="home-page-wrapper page1">
        <div className="page" >
          <h2 className="mt-5">What is Atila?</h2>
            <h4 className="text-center text-white p-5">
                Atila is a free website that helps you get more money for school
                by making it easy to find and apply to scholarships.
            </h4>
            <h2>Atila Does 3<sup>*</sup> Things</h2>
            <QueueAnim
              component={Row}
              key="queue"
              type="bottom"
              ease={['easeOutQuart', 'easeInQuart']}
              leaveReverse
            >
              {threeThingsChildren}
            </QueueAnim>
            <p className="text-center text-white mt-5">
                <sup>*</sup>(We do a lot of other stuff as well, but you get the idea {' '}
                <span role="img" aria-label="winky face emoji">😉</span>)
            </p>
        </div>
      </div>
    );
  }
}
