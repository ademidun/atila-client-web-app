import React, { Component } from "react";
import { Row, Col, Tabs } from "antd";
import "../Ebook/Ebook.scss";
/* eslint-disable no-unused-vars */
// The tableau library needs to be imported even though it will be used
// via window.tableau.Viz and not tableau.Viz
// noinspection ES6UnusedImports
import tableau from "tableau-api";
/* eslint-enable no-unused-vars */

const TabPane = Tabs.TabPane;
let viz;

export default class EbookPremiumTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industry: "InvestmentBanking",
      industryConfig: {
        "Tech": {
          name: "Tech",
          label: "Google, Amazon, Facebook, and more",
          vizUrl: "https://public.tableau.com/views/EntryLevelGoogleSoftwareEngineerBaseSalaryinWaterloovsMountainViewCAD/Sheet5?:display_count=y&:origin=viz_share_link",
        },
        "Biomedical": {
          name: "Biomedical",
          label: "Pfizer, GSK, and more",
          vizUrl: "https://public.tableau.com/views/WhatSchoolsDoBiomedCompaniesHireFromOrganizedbyPosition/Sheet4?:display_count=y&:origin=viz_share_link",
        },
        "InvestmentBanking": {
          name: "InvestmentBanking",
          label: "Goldman Sachs, RBC Capital Markets and more",
          vizUrl: "https://public.tableau.com/views/EntryLevelGoogleProductManagervsGoldmanSachsAnalystinNYCUSD/Sheet4?:display_count=y&:origin=viz_share_link",
        },
        "Consulting": {
          name: "Consulting",
          label: "McKinsey, Bain, BCG, and more",
          vizUrl: "https://public.tableau.com/views/WhatSchoolsDoCompaniesHireFromOrganizedbyCompanySchoolsNumbers/Sheet2?:display_count=y&:origin=viz_share_link",
        },
      }
    };
  }

  createViz(industry) {
    const { industryConfig } = this.state;
    const vizUrl = industryConfig[industry].vizUrl;

    const vizContainer = this.vizContainer;
    viz = new window.tableau.Viz(vizContainer, vizUrl);
  }

  componentDidMount() {
    const { industry } = this.state;
    console.log(industry);

    this.createViz(industry);
  }

  componentDidUpdate() {
    const { industry } = this.state;
    console.log(industry);

    viz.dispose();
    this.createViz(industry);

  }

  changeTab = (activeKey) => {
    this.setState({
      industry: activeKey,
    });
  };

  render() {

    return (
      <Row>
        <Col>
          <div className='text-center'>
            <Tabs
              defaultActiveKey='InvestmentBanking'
              id='UserProfileViewTabs'
              onChange={(e) => this.changeTab(e)}
            >
              <TabPane tab='InvestmentBanking' key='InvestmentBanking'>
                <React.Fragment>
                  Hello
                  <div
                    ref={(div) => {
                      this.vizContainer = div;
                    }}
                  ></div>
                </React.Fragment>
              </TabPane>

              <TabPane tab='Tech' key='Tech'>
                <React.Fragment>
                  hi
                  <div
                    ref={(div) => {
                      this.vizContainer = div;
                    }}
                  ></div>
                </React.Fragment>
              </TabPane>

              <TabPane tab='Biomedical' key='Biomedical'>
                <React.Fragment>
                  howdy
                  <div
                    ref={(div) => {
                      this.vizContainer = div;
                    }}
                  ></div>
                </React.Fragment>
              </TabPane>
              <TabPane tab='Consulting' key='Consulting'>
                <React.Fragment>
                  meow
                  <div
                    ref={(div) => {
                      this.vizContainer = div;
                    }}
                  ></div>
                </React.Fragment>
              </TabPane>
            </Tabs>
          </div>
        </Col>
      </Row>
    );
  }
}
