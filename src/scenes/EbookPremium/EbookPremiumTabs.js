import React, { Component } from "react";
import { Row, Col } from "antd";
import "../Ebook/Ebook.scss";
import { Tab, Tabs } from "react-bootstrap";

export default class EbookPremiumTabs extends Component {
  componentDidMount() {
    const techTierVizUrl =
      "https://public.tableau.com/views/EntryLevelGoogleSoftwareEngineerBaseSalaryinWaterloovsMountainViewCAD/Sheet5?:display_count=y&:origin=viz_share_link";
    const biomedicalTierVizUrl =
      "https://public.tableau.com/views/WhatSchoolsDoBiomedCompaniesHireFromOrganizedbyPosition/Sheet4?:display_count=y&:origin=viz_share_link";
    const investmentbankingTierVizUrl =
      "https://public.tableau.com/views/EntryLevelGoogleProductManagervsGoldmanSachsAnalystinNYCUSD/Sheet4?:display_count=y&:origin=viz_share_link";
    const consultingTierVizUrl =
      "https://public.tableau.com/views/WhatSchoolsDoCompaniesHireFromOrganizedbyCompanySchoolsNumbers/Sheet2?:display_count=y&:origin=viz_share_link";

    const techVizContainer = this.techVizContainer;
    const biomedicalVizContainer = this.biomedicalVizContainer;
    const investmentbankingVizContainer = this.investmentbankingVizContainer;
    const consultingVizContainer = this.consultingVizContainer;

    /* eslint-disable no-unused-vars */
    // noinspection JSUnusedLocalSymbols
    let techTierViz = new window.tableau.Viz(techVizContainer, techTierVizUrl);
    let biomedicalTierViz = new window.tableau.Viz(
      biomedicalVizContainer,
      biomedicalTierVizUrl
    );
    let investmentbankingTierViz = new window.tableau.Viz(
      investmentbankingVizContainer,
      investmentbankingTierVizUrl
    );
    let consultingTierViz = new window.tableau.Viz(
      consultingVizContainer,
      consultingTierVizUrl
    );
  }

  render() {
    return (
      <Row>
        <Col>
          <div className='text-center'>
            <Tabs transition={false} id='UserProfileViewTabs'>
              <Tab eventKey='InvestmentBanking' title='Investment Banking'>
                <div
                  ref={(div) => {
                    this.investmentbankingVizContainer = div;
                  }}
                ></div>
              </Tab>

              <Tab eventKey='Tech' title='Tech'>
                <div
                  ref={(div) => {
                    this.techVizContainer = div;
                  }}
                ></div>
              </Tab>

              <Tab eventKey='Biomedical' title='Biomedical'>
                <div
                  ref={(div) => {
                    this.biomedicalVizContainer = div;
                  }}
                ></div>
              </Tab>
              <Tab eventKey='Consulting' title='Consulting'>
                <div
                  ref={(div) => {
                    this.consultingVizContainer = div;
                  }}
                ></div>
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    );
  }
}
